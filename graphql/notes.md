# GraphQL - An Introduction

## Show of hands iIII/
- REST APIs?
- Mobile only, Desktop only, Mobile + Desktop?

## Worked with REST APIs?
- Good News n Bad News

## Whats REST?
- Principles
- Stateless servers
- Structured access to resources

## Problems with REST:
- Strict Specs but wildly interpreted
- Hard coded; can't adopt to changing requirements on client side
- Not based on clients' need/intent
- Versioning
- Under/over fetching
- Requests rainfall/waterfall
- Documentation
- No concept of components
- Speed of Thought

## Can we do better?
- Increased mobile usage needs efficient data loading
- A consistent way of data fetching from client independent of framework/tech/platform
- Fastest development for rapid feature releases

## How GraphQL address these:
- Declarative
- Demand Driven
- Flexible & Efficient
- Request up, render down

## What is GraphQL?
- What it is not
- Official definition
- Bleeding Edge; there will be blood
- New API standard that was invented & open sourced by Facebook
- Enables declarative data fetching
- GraphQL server exposes single endpoint and responds to queries based on request payload
- Query Language for APIs
### SS

## Courtesy:
- How to GraphQL
- GraphQL official site
- TicketMaster example
- JSChannel Talk
- Dont throw tomatoes
- Why Reinvent when we can reuse
- Specs: facebook.github.io/graphql/

## GraphQL is not just for React Developers
- Released as specs
- GraphQL can be used with any programming language and framework
- A rapidly growing community
### SS 
### SS

## How is GraphQL better?
- Blogging App
### SS

## Core Concepts:
- Type System to define capabilities of APIs
- Schema Definition Language
- Schema serves as contract between client and server
- Frontend and backend teams can work indepedently
### SS
  - Queries
  - Mutation (create/update/delete)
  - Subscription
- The GraphQL Schema
  - Define capabilies of the API by specifying how a client can fetch and update data
  - Collection of GraphQL types with special root types
- Root Types
- Query Type
- Mutation Type
- Subscription Type
### SS

## Architectural Use Cases:
- Progessive Enhancement
1. GraphQL server with a connected database
  Used for greenfield projects
  Uses single web server that implements GraphQL
2. GraphQL server to integrate existing system
  Legacy infrastructures and many different APIs
  GraphQL can unify existing systems and hide complexity of data fetching logic
3. Hybrid approach with connected database and integration of existing system

- Resolver functions
  GraphQL queries/mutations consist of set of fields
  GraphQL server has one resolver function per field
  Purpose of each resolver is to retrieve the data for its corresponding field

- From imperative to declarative data fetching
Imperative
- 1. Construct and send HTTP request
- 2. Receive and parse server response
- 3. Store data locally
- 4. Display information in the UI

Declarative
1. Describe data requirements
2. Display information in the UI

## TM Demo: