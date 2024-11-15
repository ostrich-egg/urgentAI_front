

export const reverseGeoCoding = async (server_lat: number, server_long: number): Promise<string> => {
    let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${server_lat}%2C${server_long}&key=72d397af64c14f3c9aa580ae21e5c5b1`, {
        method: "GET"
    });

    let data = await response.json();
    return data.results[0].formatted;

}

export const forwardGeoCoding = async (location: string, country: string = "Nepal"): Promise<{ lat: number, lng: number }> => {


    let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${location}%2C${country}&key=72d397af64c14f3c9aa580ae21e5c5b1`, {
        method: "GET"
    });

    let data = await response.json();
    return data.results[0].geometry;

}