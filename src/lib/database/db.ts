
type data = {
    id: number,
    title: string,
    severity: string,
    time: string
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
