export const deleteId = 'fdsafdsafdasfdsafdafdfdsa';
export const updateId = '5dce078376087d15e0e20997';

export default {
    players: {
        [updateId]: {
            "name": "David",
            "color": "168, 50, 160"
        },
        [deleteId]: {
            "name": "bob",
            "color": "168, 50, 160"
        }
    },
    games: {
        "1": {
            [updateId]: {
                "score": 300,
                "name": "David"
            },
            [deleteId]: {
                "name": "bob",
                "score": 156
            }
        }
    }
}