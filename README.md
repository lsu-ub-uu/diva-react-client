# diva-react-client

This repository contains the codebase for the React client for DiVA (www.diva-portal.org/).
It is comprised of three different projects:

1. diva-cora-ts-api-wrapper
2. diva-resource-fetcher
3. diva-react-client

# Overview

## diva-cora-ts-api-wrapper

This project contains a typescript API wrapper around Coras REST-API. The goal is to be able to interact with the API solely through this wrapper.
In the future, the wrapper should be extracted from this repository and be made accessible in its own repository in the hope that other developers (e.g. at member organisations) find it useful.

## diva-resource-fetcher

This project contains code to download resources that seldomly change through Coras API. This code should be run at every deploy of diva-react-client. Currently it fetches DomainCollection and LoginUnits.
In the future, more seldom-updated system-metadata should be added here. The goal is to take advantage of Coras feature to update metadata on-the-fly and avoid hardcoding, while at the same time decreasing the amount of data diva-react-client would have to download through the REST-API on each launch.

## [diva-react-client](https://github.com/lsu-ub-uu/diva-react-client/tree/master/diva-react-client#readme)

This project contains code for the actual [diva-react-client](https://github.com/lsu-ub-uu/diva-react-client/tree/master/diva-react-client#readme).

# Development

For development it is recommended to use the dockerized dev environment [cora-vscodium](https://github.com/lsu-ub-uu/cora-vscodium). Head over there to get up and running.
