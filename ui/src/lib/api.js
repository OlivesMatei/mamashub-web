import { getCookie } from './cookie';

export let apiHost = (process.env['REACT_APP_NODE_ENV'] === "development") ? "http://127.0.0.1:8080" :  process.env['REACT_APP_API_URL'];

export let createEncounter = async (patientId, encounterCode) => {
    try {
        let encounter = await (await fetch(`${apiHost}/crud/encounters`, {
            method: 'POST',
            body: JSON.stringify({
                encounterCode,
                patientId: patientId
            }),
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${getCookie("token")}`,
            }
        })).json()
        console.log(encounter)

        return encounter.id
    } catch (error) {
        return null
    }
}

export let FhirApi = async (params) => {
    let _defaultHeaders = {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${getCookie("token")}`,
    }
    //To-do: replace with basicAuth configuration
    try {
        let response = await fetch(String(`${apiHost}${params.url}`), {
            headers: _defaultHeaders,
            method: params.method ? String(params.method) : 'GET',
            ...(params.method !== 'GET') && (params.method !== 'DELETE') && { body: String(params.data) }
        })
        let responseJSON = await response.json()
        let res = {
            status: "success",
            statusText: response.statusText,
            data: responseJSON
        }
        return res
    } catch (error) {
        console.error(error)
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            error: error
        }
        console.error(error)
        return res
    }
    //To-do: process response and response type
}
