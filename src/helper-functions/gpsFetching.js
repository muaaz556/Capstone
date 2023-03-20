import { NGROK_URL } from '@env'

export const getGPSData = async (urlPath = "get-gps", queryString = "") => {
    let response;
    if(queryString != ""){
        queryString = "?" + queryString
    }
     
    // If you are getting bad json, add a console log here (cannot be an existing one)
    // console.log("add/remove me to fix fetching issues") 
    await fetch(`${NGROK_URL}/api/${urlPath}${queryString}`, {
        method: 'GET',
        headers: {
            "access-control-allow-origin": "*",
            'Accept': 'application/json',
            'Content-type': 'application/json',
        },
    }).then(res => {
        console.log(res);
        if (res.ok) {
            return res.json();
        } else {
            throw res.json();
        }
    }).then(json => {
        console.log("Good JSON ", json)
        response = json;
    }).catch(error => {
        console.log("Bad JSON ", error)
    })
    
    return response;
}

export const postGPSData = async (requestData, urlPath = "post-gps") => {
    await fetch(`${NGROK_URL}/api/` + urlPath, {
        method: 'POST',
        headers: {
            "access-control-allow-origin": "*",
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: requestData,
    }).catch(error => {
        console.log("Bad JSON", error)
    })
}