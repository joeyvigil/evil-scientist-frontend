
"""
This Service accomplishes the same thing as langgraph_service
BUT we'll use an AGENT in the routing node instead of keyword matching
The vectorDB retrieval nodes become tools
The chat nodes pretty much stay the same
"""
from typing import TypedDict, Any, Annotated

from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage
from langchain_core.messages.tool import tool_call
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import add_messages, StateGraph

from app.services.vectordb_service import search

llm = ChatOllama(
    model="llama3.2:3b", # The model we're using (we installed llama3.2:3b)
    temperature=0.2 # Temp goes from 0-1. Higher temp = more creativity
)

# Same state as the old service
class GraphState(TypedDict, total=False): #total=False makes all fields optional
    query: str
    route: str
    docs: list[dict[str, Any]]
    answer: str
    # with add_messages reducer
    message_memory: Annotated[list[BaseMessage], add_messages]


# TOOLS ---------------------------
# The agentic route node will use one or none of these based on the User's query
# Remember, tools are just python functions that an agent CAN execute at run time
# We also won't directly use state in a tool. The agent calls these.
# IMPORTANT: Each tool needs '''docstrings''' to describe what they do for the agent

@tool(name_or_callable="extract_items")
def extract_items_tool(query:str) -> list[dict[str, Any]]:
    """
    Based on the user's input, the "query" arg, do a semantic search.
    Retrieve relevant evil items or products based on the evil_items vectorDB collection.
    """
    return search(query, k=5, collection="evil_items")

@tool(name_or_callable="extract_plans")
def extract_plans_tool(query:str) -> list[dict[str, Any]]:
    """
    Based on the user's input, the "query" arg, do a semantic search.
    Retrieve relevant docs on the boss's plans/schemes based on the boss_plans vectorDB collection.
    """
    return search(query, k=10, collection="boss_plans")

# Some variables that will help us make the agent aware of the tools

# List of the available tools
TOOLS = [extract_items_tool, extract_plans_tool]

# Map tool names to their functions in a scalable way
# We need this to call tools by their name in the agentic router node
# (See us defining and assigning names in the agentic router node)
TOOL_MAP = {tool.name: tool for tool in TOOLS}

# Get a version of the LLM that is aware of its toolbox
llm_with_tools = llm.bind_tools(TOOLS)

# NODES (including our agentic router)--------------------------------------------

# Here's the AGENT part - this routing node uses agentic AI to determine what tool to call, if any
def agentic_router_node(state: GraphState) -> GraphState:

    # Get the user query from State
    query = state.get("query", "")

    # Using this different chat prompting style just cuz it looks cool
    # Feel free to use the typical prompt string like we've been doing
    messages = [
        SystemMessage(content=(
            """
            You are an internal agent that decides whether VectorDB retrieval is needed. 
            If the User is asking about product, items, recs, prices, etc., use the "extract_items" tool. 
            If the User is asking about their boss's evil plans or schemes, use the "extract_plans" tool. 
            If neither applies or the user is just stating something, it's a general chat. 
            DO NOT call a tool for general chats. 
            If you call a tool, call EXACTLY ONE tool.
            """
        )),
        HumanMessage(content=query)
    ]

    # First LLM call to decide which tool to use
    agentic_response = llm_with_tools.invoke(messages)

    # If there was no tool call, route to general chat
    # tool_calls contains a list of ToolCall objects, which has metadata like the tool name
    if not agentic_response.tool_calls:
        return {"route":"chat"}

    # If a tool WAS called, invoke it and store results and the appropriate route in State
    tool_call = agentic_response.tool_calls[0] # We only expect one tool call
    tool_name = tool_call["name"] # Extract the name of the tool that was called

    # Finally, here's us actually invoking the tool by name
    results = TOOL_MAP[tool_name].invoke({"query":query})

    # Automatically set the route to the answer_with_context node
    return {
        "route":"answer",
        "docs": results
    }

# ANSWER WITH CONTEXT & GENERAL CHAT will stay the same as before :)

# The node that answers the user's query based on docs retrieved from either "extract" node
def answer_with_context_node(state: GraphState) -> GraphState:

    query = state.get("query", "")
    docs = state.get("docs", [])
    combined_docs = "\n\n".join(item["text"] for item in docs)

    prompt = (
        f"You are an internal assistant at the Evil Scientist Corp."
        f"You are pretty evil yourself, but still helpful."
        f"Answer the User's Query based ONLY on the Extracted Data below."
        f"If the data doesn't help, say you don't know."
        f"Extracted Data:\n{combined_docs}"
        f"User Query:\n{query}"
        f"Answer: "
    )

    response = llm.invoke(prompt)
    return {"answer":response}

# Here's the fallback node for general chats (no tools)
def general_chat_node(state: GraphState) -> GraphState:

    prompt = (
        f"""You are an internal assistant at the Evil Scientist Corp.
        You are pretty evil yourself, but still helpful.
        You have context from previous interactions: \n{state.get('message_memory')}
        Answer the User's Query to the best of your ability.
        User Query:\n{state.get('query','')}
        Answer: """
    )

    result = llm.invoke(prompt).content
    return {"answer":result,
            "message_memory": [
                HumanMessage(content=state.get("query")),
                AIMessage(content=result)
            ]
            }

# THE GRAPH BUILDER --------------------------------
# Mostly the same, but uses our new agentic router, and the tools are no longer nodes
def build_agentic_graph():

    # Define the graph state and the build variable
    build = StateGraph(GraphState)

    # Register each node within the graph
    # NOTE: extract_items and extract_plans are TOOLS now, not nodes
    build.add_node("route", agentic_router_node)
    build.add_node("answer", answer_with_context_node)
    build.add_node("chat", general_chat_node)

    # Set our entry point node (the first one to invoke after a user query)
    build.set_entry_point("route")

    # After the router runs, conditionally choose the next node based on "route" in state
    build.add_conditional_edges(
        "route", # Based on the "route" state field...
        lambda state: state["route"], # Getting the value
        {
            "answer":"answer", # If route is "answer, go to answer node
            "chat":"chat" # Otherwise, go to chat node
        }
    )

    # After answer OR chat invoke, we're done! Set that.
    build.set_finish_point("answer")
    build.set_finish_point("chat")

    # Finally, compile and return the graph, with a Memory Checkpointer
    return build.compile(checkpointer=MemorySaver())

# Create a singleton instance of the graph for use in the router endpoint
agentic_graph = build_agentic_graph()