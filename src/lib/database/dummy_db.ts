"use client"

type data = {
    id: number,
    title: string,
    severity: string,
    time: string
}


declare global {
    interface DataItem {
        messages?: Array<{
            message?: string;
            author?: string;
            audio?: string | null;
            sequence: number;
            sent_at: number;
        }> | null;
        located_at: string | null;
        session_id: string;
        unrated?: boolean;
        average_severity?: number;
        short_description?: string;
        description?: string;
    }
}

export async function get_all_data() {

    // const response = await fetch("/url", { "method": "GET", });
    // const data = await response.json();
    const data = [
        {
            "id": 1,
            "session_id": "session_123",
            "average_serverity": 5,
            "short_description": "Test Child Lost",
            "description": "Detailed description here.",
            "located_at": {
                "latitude": 27.7172,
                "longitude": 85.3240
            },
            "task": {
                "action": "CALL",
                "payload": "1098",
            },
            "messages": [
                {
                    "id": 1,
                    "message": "Hello someone stole my necklace",
                    "audio": "audio_file_path",
                    "author": "John Doe",
                    "sequence": 1,
                    "sent_at": "2024-11-15"
                },
                {
                    "id": 2,
                    "message": "Omg! for real?",
                    "audio": "audio_file_path",
                    "author": "bot",
                    "sequence": 2,
                    "sent_at": "2024-11-16"
                }
            ]
        },
        {
            "id": 2,
            "session_id": "session_123",
            "average_serverity": 5,
            "short_description": "Test Child Lost",
            "description": "Detailed description here.",
            "located_at": {
                "latitude": 28.2096,
                "longitude": 83.9856
            }
            ,
            "task": {
                "action": "CALL",
                "payload": "1098",
            },
            "messages": [
                {
                    "id": 1,
                    "message": "Hello someone stole my necklace",
                    "audio": "audio_file_path",
                    "author": "John Doe",
                    "sequence": 1,
                    "sent_at": "2024-11-15"
                },
                {
                    "id": 2,
                    "message": "Omg! for real?",
                    "audio": "audio_file_path",
                    "author": "bot",
                    "sequence": 2,
                    "sent_at": "2024-11-16"
                }
            ]
        },
        {
            "id": 3,
            "session_id": "session_123",
            "average_serverity": 5,
            "short_description": "Test Child Lost",
            "description": "Detailed description here.",
            "located_at": {
                "latitude": 26.4550,
                "longitude": 87.2701
            },
            "task": {
                "action": "CALL",
                "payload": "1098",
            },
            "messages": [
                {
                    "id": 1,
                    "message": "Hello someone stole my necklace",
                    "audio": "audio_file_path",
                    "author": "John Doe",
                    "sequence": 1,
                    "sent_at": "2024-11-15"
                },
                {
                    "id": 2,
                    "message": "Omg! for real?",
                    "audio": "audio_file_path",
                    "author": "bot",
                    "sequence": 2,
                    "sent_at": "2024-11-16"
                }
            ]
        }
    ]

    return data;

}





export async function get_data_with_id(id: string) {

    // const response = await fetch("/url/id=id", { "method": "GET" });
    // const data = await response.json();


    const data = [
        {
            "id": 1,
            "session_id": "session_123",
            "average_serverity": 7,
            "short_description": "Test Child Lost",
            "description": "Detailed description here.",
            "located_at": {
                "latitude": 27.7172,
                "longitude": 85.3240
            },
            "task": {
                "action": "CALL",
                "payload": "1098",
            },
            "messages": [
                {
                    "id": 1,
                    "message": "Hello someone stole my necklace",
                    "audio": "audio_file_path",
                    "author": "John Doe",
                    "sequence": 1,
                    "sent_at": "2024-11-15"
                },
                {
                    "id": 2,
                    "message": "Omg! for real?",
                    "audio": "audio_file_path",
                    "author": "bot",
                    "sequence": 2,
                    "sent_at": "2024-11-16"
                }
            ]
        },
        {
            "id": 2,
            "session_id": "session_123",
            "average_serverity": 9,
            "short_description": "Bus accident",
            "description": "Detailed description here.",
            "located_at": {
                "latitude": 28.2096,
                "longitude": 83.9856
            },
            "task": {
                "action": "CALL",
                "payload": "1098",
            },
            "messages": [
                {
                    "id": 1,
                    "message": "Hello someone stole my necklace",
                    "audio": "audio_file_path",
                    "author": "John Doe",
                    "sequence": 1,
                    "sent_at": "2024-11-15"
                },
                {
                    "id": 2,
                    "message": "Omg! for real?",
                    "audio": "audio_file_path",
                    "author": "bot",
                    "sequence": 2,
                    "sent_at": "2024-11-16"
                }
            ]
        },
        {
            "id": 3,
            "session_id": "session_123",
            "average_serverity": 5,
            "short_description": "nigga robbed me",
            "description": "Detailed description here.",
            "located_at": {
                "latitude": 27.7172,
                "longitude": 85.3240
            },
            "task": {
                "action": "CALL",
                "payload": "1098",
            },
            "messages": [
                {
                    "id": 1,
                    "message": "Hello someone stole my necklace",
                    "audio": "audio_file_path",
                    "author": "John Doe",
                    "sequence": 1,
                    "sent_at": "2024-11-15"
                },
                {
                    "id": 2,
                    "message": "Omg! for real?",
                    "audio": "audio_file_path",
                    "author": "bot",
                    "sequence": 2,
                    "sent_at": "2024-11-16"
                }
            ]
        }
    ]

    return data.find(each => each.session_id == id)

}


export async function get_all_initial_info() {

    const response = await fetch("https://brave-titmouse-primary.ngrok-free.app/recorded-data", { "method": "GET", });
    const data = await response.json();

    console.log("data is ", data);

    // const data = [
    //     {
    //         "id": 1,
    //         "short_description": "Child Lost",
    //         "located_at": {
    //             "latitude": 27.7172,
    //             "longitude": 85.3240
    //         },
    //         "tasks": [{
    //             "action": "CALL",
    //             "payload": "1098",
    //         }],
    //         "time": 1504095567183,
    //         "average_serverity": 2,
    //     },
    //     {
    //         "id": 2,
    //         "short_description": "Theft",
    //         "located_at": {
    //             "latitude": 28.2096,
    //             "longitude": 83.9856
    //         },
    //         "tasks": [],
    //         "time": 1504095567183,
    //         "average_serverity": 8,
    //     },
    //     {
    //         "id": 3,
    //         "short_description": "Landslide",
    //         "located_at": {
    //             "latitude": 26.4550,
    //             "longitude": 87.2701
    //         },
    //         "tasks": [],
    //         "time": 150495567183,
    //         "average_serverity": 9,
    //     },
    // ]
    return data;
}

export const data: data[] = [
    { id: 1, title: "Affair", severity: "normal", time: "6:00pm" },
    { id: 2, title: "Theft", severity: "critical", time: "12:00pm" },
    { id: 3, title: "Fire", severity: "critical", time: "11:00AM" },
];

export const users = [
    {
        id: 1, data_id: 1, location: "dhulikhel", messages: [
            { sender: "User", message: "Affair happened", time: "6:05pm" },
            { sender: "Chatbot", message: "What happened in the affair?", time: "6:05pm" },
            { sender: "User", message: "It seems there was a disagreement between the parties.", time: "6:06pm" },
            { sender: "Chatbot", message: "Who is involved?", time: "6:10pm" },
            { sender: "User", message: "The key individuals are John and Jane.", time: "6:11pm" },
        ]
    },

    {
        id: 2, data_id: 2, location: "Kathmandu", messages: [
            { sender: "User", message: "Theft just came here", time: "6:05pm" },
            { sender: "Chatbot", message: "What did he theft?", time: "6:05pm" },
            { sender: "User", message: "It seems here stole my heart.", time: "6:06pm" },
            { sender: "Chatbot", message: "Who is involved?", time: "6:10pm" },
            { sender: "User", message: "The key individuals are Nigga and Kim.", time: "6:11pm" },
        ]
    },

    {
        id: 3, data_id: 3, location: "butwal", messages: [
            { sender: "User", message: "Fire happened", time: "6:05pm" },
            { sender: "Chatbot", message: "What happened in the there?", time: "6:05pm" },
            { sender: "User", message: "It seems there was a loss in property.", time: "6:06pm" },
            { sender: "Chatbot", message: "Who is involved?", time: "6:10pm" },
            { sender: "User", message: "The key individuals are John and Jane.", time: "6:11pm" },
        ]
    }
];



declare global {
    type PoliceStation = {
        located_at: {
            location: string
            lat: number;
            lng: number;
        };
    };
}

export const policeStations: PoliceStation[] = [
    {
        located_at: {
            location: "Biratnagar",
            lat: 26.4550, // Biratnagar
            lng: 87.2701
        }
    },
    {
        located_at: {
            location: "Janakpur",
            lat: 26.6950, // Janakpur
            lng: 85.8988
        }
    },
    {
        located_at: {
            location: "Kathmandu",
            lat: 27.7172, // Kathmandu
            lng: 85.3240
        }
    },
    {
        located_at: {
            location: "Pokhara",
            lat: 28.2096, // Pokhara
            lng: 83.9856
        }
    },
    {
        located_at: {
            location: "Butwal",
            lat: 27.6954, // Butwal
            lng: 83.4427
        }
    },
    {
        located_at: {
            location: "Dhangadhi",
            lat: 29.6824, // Dhangadhi
            lng: 80.5689
        }
    },
    {
        located_at: {
            location: "Mahendranagar",
            lat: 29.3762, // Mahendranagar
            lng: 80.0204
        }
    }
];