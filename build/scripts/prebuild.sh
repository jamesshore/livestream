# Prerequisites to run tests or local server

[ ! -f node_modules/.bin/mocha ] && npm rebuild

export AUTH_SECRET=foo
export TZ=America/New_York

if [ -z "$STATS_INTERVAL_IN_SECONDS" ]
then
	export STATS_INTERVAL_IN_SECONDS=60
fi

if [ -z "$PERSONA_AUDIENCE" ]
then
	export PERSONA_AUDIENCE=localhost:5000
fi

if [ -z "$AUTH0_DOMAIN" ]
then
	export AUTH0_DOMAIN=titaniumit.auth0.com
fi

if [ -z "$AUTH0_CLIENT_ID" ]
then
	export AUTH0_CLIENT_ID=5h8ov910aGp4NvZo67n03vyW43yK1jqm
fi

if [ -z "$AUTH0_CLIENT_SECRET" ]
then
	export AUTH0_CLIENT_SECRET=auth0_client_secret_placeholder
fi

if [ -z "$AUTH0_MANAGEMENT_API_SECRET_TOKEN" ]
then
	export AUTH0_MANAGEMENT_API_SECRET_TOKEN=auth0_management_api_secret_token_placeholder
fi

if [ -z "$AUTH0_CONNECTION" ]
then
	export AUTH0_CONNECTION=Lets-Code-JavaScript-DB
fi

if [ -z "$RECURLY_API_KEY" ]
then
	export RECURLY_API_KEY=recurly_api_key_placeholder
fi

