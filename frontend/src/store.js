import { createStore } from "vuex";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client/core";


const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql',
})

const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

const store = createStore({
    state() {
        return {
            products: [],
            detail: {},
            cart: [],
            token: "",
            totalPrice: 0,
            shoppingList: [],
            orderHistory: []
        };
    },

    mutations: {
        setProducts(state, products) {
            state.products = products;
        },

        setDetail(state, detail) {
            state.detail = detail;
        },

        setCart(state, cart) {
            state.cart = cart;
        },

        setTotalPrice(state, totalPrice) {
            state.totalPrice = totalPrice
        },

        setToken(state, token) {
            state.token = token
        },
        setShoppingList(state, shoppingList) {
            state.shoppingList = shoppingList
        },
        setOrderHistory(state, orderHistory) {
            state.orderHistory = orderHistory
        }
    },

    actions: {
        async loadProducts({ commit }, { userId = '', categoryName = '' }) {
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query($userId: String, $categoryName: String) {
                        fetchProducts(findProductsInput:{
                            userId: $userId
                            categoryName: $categoryName
                        }) {
                            productId
                            productName
                            description
                            price
                            isSoldOut
                            hits
                            user {
                                userId
                                email
                                userName
                            }
                            productCategory {
                                productCategoryId
                                categoryName
                            }
                            productTags {
                                productTagId
                                tagName
                            }
                        }
                    }
                `,
                    variables: {
                        userId: userId || null,
                        categoryName: categoryName || null
                    },
                });
                commit('setProducts', result.data.fetchProducts);
            } catch (error) {
                console.error("Failed to load products: ", error);
            }
        },
    },
});

export { store, apolloClient };






// productsDetail(context, payload) {
//     axios.get(`http://localhost:3000/api/products/${payload}`).then((res) => {
//         context.commit("setDetail", res.data);
//     });
// },

// cartRegister(context, payload) {
//     axios.post(`http://localhost:3000/api/cart/${context.state.detail.productsId}`, { quantity: payload }, { headers: { token: this.state.token } }).catch(err => { alert("로그인 해주세요.", err) });
// },

// cartList(context) {
//     axios.get(`http://localhost:3000/api/cart`, { headers: { token: this.state.token } }).then((res) => {
//         context.commit("setCart", res.data);
//     }).catch(err => {
//         alert(err.response.data.errormessage)
//         router.push("/")
//     });
// },

// cartChange(context, payload) {
//     axios.patch("http://localhost:3000/api/cart/update", payload, { headers: { token: this.state.token } })
// },

// cartDelete(context, payload) {
//     axios.delete(`http://localhost:3000/api/cart/delete/${payload}`, { headers: { token: this.state.token } })
// },

// signUp(context, payload) {
//     return new Promise((resolve, reject) => {
//         axios.post("http://localhost:3000/api/users", payload).then((res) => {
//             if (res.status === 201) {
//                 resolve(res.data)
//             }
//         }).catch(error => {
//             console.log(error);
//             reject(error);
//         })
//     })
// },

// signIn(context, payload) {
//     return new Promise((resolve, reject) => {
//         axios.post("http://localhost:3000/api/auth", payload).then(res => {
//             context.commit("setToken", res.data.token)

//             resolve("success")
//         }).catch(error => {
//             reject(error)
//         })
//     })
// },

// shoppingListPost(context, payload) {
//     return new Promise((resolve, reject) => {
//         axios.post("http://localhost:3000/api/buy", payload, { headers: { token: this.state.token } }).then(() => {
//             resolve("success")
//         }).catch(error => {
//             reject(error)
//         })
//     })
// },

// orderHistoryGet(context) {
//     return new Promise((resolve, reject) => {
//         axios.get("http://localhost:3000/api/buy", { headers: { token: this.state.token } }).then(res => {
//             context.commit("setOrderHistory", res.data)
//             resolve("success")
//         }).catch(error => {
//             reject(error)
//         })
//     })
// }