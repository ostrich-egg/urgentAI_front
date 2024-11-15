"use client"

type Wikipedia = {
    ns: number,
    pageid: number,
    title: string,
    pageimage?: string,
    thumbnail?: {
        height: number,
        source: string,
        width: number
    },
}

export default async function get_image(place: string) {

    try {
        const url = `http://en.wikipedia.org/w/api.php?action=query&titles=${place}&prop=pageimages&format=json&pithumbsize=800&origin=*`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "User-Agent": "aether"
            }
        });
        const res = await response.json();
        if (!res) return undefined;

        const obj = ((Object.entries(res.query.pages)[0])[1]) as Wikipedia;
        return obj.thumbnail?.source

    } catch (error) {

    }
}