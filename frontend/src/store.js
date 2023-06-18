import { createStore } from "vuex";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql',
    fetchOptions: {
        credentials: 'include',
        // credentials: 'same-origin'
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
            product: {},
            cartList: [],
            token: "",
            totalPrice: 0,
            waitingListForPurchase: [],
            orderList: [],
            user: {}
        };
    },

    mutations: {
        setTotalPrice(state, totalPrice) {
            state.totalPrice = totalPrice;
        },

        setUser(state, user) {
            state.user = user
        },

        setProducts(state, products) {
            state.products = products;
        },

        setProduct(state, product) {
            state.product = product;
        },

        setCartList(state, cartList) {
            state.cartList = cartList;
        },

        setToken(state, token) {
            state.token = token
        },
        setWaitingListForPurchase(state, waitingListForPurchase) {
            state.waitingListForPurchase = waitingListForPurchase
        },
        setOrderList(state, orderList) {
            state.orderList = orderList
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

        async loadProduct({ commit }, productId) {
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query($productId: String!) {
                        fetchProduct(
                            productId: $productId
                        ) {
                            productId
                            productName
                            description
                            price
                            isSoldOut
                            hits
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
                        productId
                    },
                    fetchPolicy: 'no-cache',
                });
                commit('setProduct', result.data.fetchProduct);
            } catch (error) {
                console.error("Failed to load product: ", error);
            }
        },

        async increaseHits(_, productId) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($productId: String!) {
                        increaseHits(productId: $productId) {
                            hits
                        }
                    }`,
                    variables: {
                        productId
                    },
                });
                return "success";
            } catch (error) {
                console.error("Failed to increase hits: ", error);
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
                    variables: {},
                    fetchPolicy: 'no-cache',
                });
                commit('setCartList', result.data.fetchCarts);
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async cartChange(_, { productId, quantity }) {
            console.log('cartChange called');
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($productId: String!, $quantity: Int!) {
                        updateCart(updateCartInput: {
                            productId: $productId
                            quantity: $quantity
                            }) {
                                product {
                                    productId
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
                return "success";
            } catch (error) {
                throw new Error(error);
            }
        },

        async loadUser({ commit }) {
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query {
                        fetchLoginUser {
                            userId
                            userName
                            email
                            age
                        }
                    }`
                });
                commit('setUser', result.data.fetchLoginUser);
            } catch (error) {
                console.error("Failed to load user: ", error);
            }
        },

        async paymentRequest(_, { waitingListForPurchase, impUid, merchantUid, amount, deliveryAddress, contactNumber, orderInformation }) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
            mutation($createPaymentInput: CreatePaymentInput!) {
                createPayment(createPaymentInput: $createPaymentInput) {
                    impUid
                    merchantUid
                    amount
                    deliveryAddress
                    contactNumber
                    orderInformation
                }
            }`,
                    variables: {
                        createPaymentInput: {
                            waitingListForPurchase,
                            impUid,
                            merchantUid,
                            amount,
                            deliveryAddress,
                            contactNumber,
                            orderInformation,
                        },
                    },
                });
                return "success";
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async paymentCancel(_, merchantUid) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($merchantUid: String!) {
                        deletePayment(merchantUid: $merchantUid)
                    }`,
                    variables: {
                        merchantUid
                    },
                });

                return "success";
            } catch (error) {
                return error.message;
            }
        },

        async loadOrderList({ commit }) {
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query{
                        fetchOrderList {
                            orderListId
                            product {
                                productId
                                productName
                            }
                            user {
                                userId
                                userName
                            }
                            payment {
                                merchantUid
                            }
                            orderQuantity
                            deliveryAddress
                            contactNumber
                            price
                            createdAt
                            deletedAt
                        }
                    }`,
                    variables: {},
                    fetchPolicy: 'no-cache',
                });
                commit('setOrderList', result.data.fetchOrderList);
            } catch (error) {
                throw new Error(error.message);
            }
        }
    },
});

export { store, apolloClient };