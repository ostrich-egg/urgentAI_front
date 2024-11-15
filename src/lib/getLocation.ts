"use client"

export const whereAmI = async (): Promise<[number, number]> => {

    return new Promise((resolve, reject) => {

        navigator.geolocation.getCurrentPosition(
            (postion) => {
                resolve([postion.coords.latitude, postion.coords.longitude])
            },
            (error) => {
                alert(`Failed to get your location ${error}`);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 300000,
                maximumAge: 0,
            }
        )
    })
}