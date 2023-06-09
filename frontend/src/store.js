import { createStore } from "vuex";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";


const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql',
    fetchOptions: {
        // credentials: 'include',
        credentials: 'same-origin'
    },
});

const authLink = setContext((_, { headers }) => {
    const token = store.state.token;

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});


const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

const store = createStore({
    state() {
        return {
            products: [],
            detail: {},
            cartList: [],
            token: "",
            totalPrice: 0,
            shoppingList: [],
            orderHistory: [],
            loggedinEmail: "",
            userId: ""
        };
    },

    mutations: {
        setUserId(state, userId) {
            state.userId = userId;
        },

        setEmail(state, email) {
            state.loggedinEmail = email;
        },

        setProducts(state, products) {
            state.products = products;
        },

        setDetail(state, detail) {
            state.detail = detail;
        },

        setCartList(state, cartList) {
            state.cartList = cartList;
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
                    }`,
                    variables: {
                        userId: userId || null,
                        categoryName: categoryName || null
                    },
                    fetchPolicy: 'no-cache',
                });
                commit('setProducts', result.data.fetchProducts);
            } catch (error) {
                console.error("Failed to load products: ", error);
            }
        },

        async cartRegist(_, { productId, quantity }) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
            mutation($productId: String!, $quantity: Int!) {
                createCart(createCartInput: {
                    productId: $productId
                    quantity: $quantity
                }) {
                    product {
                        productId
                        productName
                    }
                    quantity
                }
            }`,
                    variables: {
                        productId,
                        quantity
                    }
                });
                return "success";
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async loadCartList({ commit }) {
            console.log('loadCartList called');
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query{
                        fetchCarts{
                            product {
                                productId
                                productName
                                description
                                isSoldOut
                                price
                            }
                            user {
                                userId
                                userName
                            }
                            quantity
                        }
                    }`,
                    variables: {
                    },
                    fetchPolicy: 'no-cache',
                });
                commit('setCartList', result.data.fetchCarts);
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async cartDelete(_, productId) {
            console.log('cartDelete called');
            try {
                await apolloClient.mutate({
                    mutation: gql`
                        mutation($productId: String!) {
                            deleteCart(productId: $productId)
                        }`,
                    variables: {
                        productId
                    }
                });
                return "success";
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async signIn({ commit }, { email, password }) {
            try {
                const result = await apolloClient.mutate({
                    mutation: gql`
                    mutation($email: String!, $password: String!) {
                        login(
                            email: $email
                            password: $password
                        ) {
                            token
                            userId
                        }
                    }`,
                    variables: {
                        email: email,
                        password: password
                    }
                });
                commit('setToken', result.data.login.token);
                commit('setEmail', email);
                commit('setUserId', result.data.login.userId);
                return "success";
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async signUp(_, { email, password, age, userName }) {
            age = parseInt(age);
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($email: String!, $password: String!, $age: Int!, $userName: String!) {
                        createUser(
                            createUserInput: {
                                email: $email
                                password: $password
                                userName: $userName
                                age: $age
                            }
                        ) {
                            userId
                            email
                        }
                    }`,
                    variables: {
                        email,
                        password,
                        age,
                        userName
                    }
                });
                return "success";
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async restoreToken({ commit }) {
            try {
                const result = await apolloClient.mutate({
                    mutation: gql`
                    mutation {
                        restoreAcessToken
                    }`
                });
                commit('setToken', result.data.restoreAcessToken);
                console.log("토큰이 제대로 실행됐는가? ", result.data.restoreAcessToken);
                return "success";
            } catch (error) {
                throw new Error(error);
            }
        }
    },
});

export { store, apolloClient };