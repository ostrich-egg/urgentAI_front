export const reverseGeoCoding = async (lat: number, lng: number): Promise<{ add1: string, add2: string }> => {
    console.log("reverse", lat, lng)
    const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=bb5bec5723c84b63a1e89ad7912e248e`, {
        method: "GET"
    });
    const data = await response.json();
    console.log('data got ', data)
    return { add1: data.features[0].properties?.address_line2, add2: data.features[0].properties?.address_line1 };
}

export const forwardGeoCoding = async (location: string, country: string = "Nepal"): Promise<{ latitude: number, longitude: number }> => {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${location}%2C%20${country}&format=json&apiKey=bb5bec5723c84b63a1e89ad7912e248e`, {
        method: "GET"
    });
    const data = await response.json();
    return { latitude: data.results[0].lat, longitude: data.results[0].lon };
}