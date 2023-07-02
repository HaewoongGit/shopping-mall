import { createStore } from "vuex";
import axios from "axios";
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
            user: {},
            userId: "",
            productForReview: {},
            review: {}
        };
    },

    mutations: {
        setReview(state, review) {
            state.review = review;
        },

        setProductForReview(state, productForReview) {
            state.productForReview = productForReview;
        },

        setTotalPrice(state, totalPrice) {
            state.totalPrice = totalPrice;
        },

        setUser(state, user) {
            state.user = user;
        },

        setUserId(state, userId) {
            state.userId = userId;
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
                            createdAt
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
                            files {
                                fileId
                                fileName
                                fileURL
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
                            files {
                                fileId
                                fileName
                                fileURL
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

        async productRegist(_, { file, categoryName, productName, price, description, productTags }) {
            try {
                let formData = new FormData();
                formData.append("operations", JSON.stringify({
                    query: `mutation ($file: Upload!) { createProduct(createProductInput: { productName: "${productName}", description: "${description}", price: ${price}, categoryName: "${categoryName}", productTags: ${JSON.stringify(productTags)}, file: $file }) { productId productName description price isSoldOut hits user { userId email userName } productCategory { productCategoryId categoryName } productTags { productTagId } } }`,
                    variables: {
                        file: null
                    }
                }));
                formData.append("map", JSON.stringify({
                    "0": ["variables.file"]
                }));
                formData.append("0", file);

                const response = await axios.post('http://localhost:3000/graphql', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Apollo-Require-Preflight': 'true',
                        'Authorization': `Bearer ${this.state.token}`
                    },
                });
                if (Object.prototype.hasOwnProperty.call(response.data, 'errors')) {
                    throw new Error('로그인 인증이 되지 않습니다.')
                }
            } catch (error) {
                if (error.response) {
                    console.log("서버에서 반환하는 에러메세지: ", error.response.data);
                }

                throw error.message;
            }
        },

        async productUpdate(_, { file, productId, categoryName, productName, price, description, productTags, isSoldOut }) {
            try {
                let formData = new FormData();
                formData.append("operations", JSON.stringify({
                    query: `mutation ($file: Upload!) { updateProduct(productId: "${productId}",updateProductInput: { productName: "${productName}", description: "${description}", price: ${price}, categoryName: "${categoryName}", productTags: ${JSON.stringify(productTags)}, file: $file, isSoldOut:${isSoldOut} }) { productId productName } }`,
                    variables: {
                        file: null
                    }
                }));
                formData.append("map", JSON.stringify({
                    "0": ["variables.file"]
                }));
                formData.append("0", file);

                const response = await axios.post('http://localhost:3000/graphql', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Apollo-Require-Preflight': 'true',
                        'Authorization': `Bearer ${this.state.token}`
                    },
                });
                if (Object.prototype.hasOwnProperty.call(response.data, 'errors')) {
                    throw new Error('로그인 인증이 되지 않습니다.')
                }
            } catch (error) {
                if (error.response) {
                    console.log("서버에서 반환하는 에러메세지: ", error.response.data);
                }

                throw error.message;
            }
        },

        async productDelete(_, productId) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
                        mutation($productId: String!) {
                            deleteProduct(productId: $productId)
                        }
                    `,
                    variables: {
                        productId
                    }
                });
            } catch (error) {
                throw new Error(error.message);
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
                                files {
                                    fileURL
                                }
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
                commit('setUserId', result.data.login.userId);
                return "success";
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async signUp(_, { email, password, phoneNumber, age, userName }) {
            age = parseInt(age);
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($email: String!, $password: String!, $phoneNumber: String!, $age: Int!, $userName: String!) {
                        createUser(
                            createUserInput: {
                                email: $email
                                password: $password
                                phoneNumber: $phoneNumber
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
                        phoneNumber,
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
                            phoneNumber
                            email
                            age
                        }
                    }`,
                    variables: {},
                    fetchPolicy: 'no-cache',
                });
                commit('setUser', result.data.fetchLoginUser);
                commit('setUserId', result.data.fetchLoginUser.userId);
            } catch (error) {
                console.error("Failed to load user: ", error);
            }
        },

        async userInfoChange(_, { password, phoneNumber, userName, age }) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
            mutation($updateUserInput: UpdateUserInput!) {
                updateUser(updateUserInput: $updateUserInput) {
                    userId
                    userName
                    email
                    phoneNumber
                    age
                }
            }`,
                    variables: {
                        updateUserInput: {
                            password,
                            phoneNumber,
                            userName,
                            age
                        },
                    },
                });
                return "success";
            } catch (error) {
                throw new Error(error.message);
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

        async paymentCancel(_, impUid) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($impUid: String!) {
                        deletePayment(impUid: $impUid)
                    }`,
                    variables: {
                        impUid
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
                                files {
                                    fileURL
                                }
                            }
                            user {
                                userId
                                userName
                            }
                            payment {
                                impUid
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
        },

        async reviewRegist(_, { productId, reviewContent, rating }) {
            console.log("reviewRegist확인", productId, reviewContent, rating);
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($productId: String!, $reviewContent: String!, $rating: Int!) {
                        createReview(createReviewInput:{
                            productId: $productId
                            reviewContent: $reviewContent
                            rating: $rating
                        }) {
                            user {
                                userId
                            }
                            product {
                                productId
                            }
                            reviewContent
                            rating
                        }
                    }`,
                    variables: {
                        productId,
                        reviewContent,
                        rating
                    }
                });
                return "success"
            } catch (error) {
                throw new Error(error);
            }
        },

        async reviewUpdate(_, { productId, reviewContent, rating }) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
                    mutation($productId: String!, $reviewContent: String!, $rating: Int!) {
                        updateReview(updateReviewInput:{
                            productId: $productId
                            reviewContent: $reviewContent
                            rating: $rating
                        }) {
                            user {
                                userId
                            }
                            product {
                                productId
                            }
                            reviewContent
                            rating
                        }
                    }`,
                    variables: {
                        productId,
                        reviewContent,
                        rating
                    }
                });
                return "success"
            } catch (error) {
                throw new Error(error);
            }
        },

        async loadRating(_, productId) {
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query($productId: String) {
                        fetchReviews(
                            findReviewsInput: {
                                productId: $productId
                            }
                        ){
                            rating
                        }
                    }`,
                    variables: {
                        productId
                    },
                    fetchPolicy: 'no-cache',
                })
                return result.data.fetchReviews;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async loadProductReviews(_, productId) {
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query($productId: String) {
                        fetchReviews(
                            findReviewsInput: {
                                productId: $productId
                            }
                        ){
                            product {
                                productName
                            }
                            user {
                                userName
                            }
                            reviewContent
                            rating
                            createdAt
                        }
                    }`,
                    variables: {
                        productId
                    },
                    fetchPolicy: 'no-cache',
                })
                return result.data.fetchReviews;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async loadMyReviews(context) {
            const userId = context.state.userId;
            console.log("loadMyReviews에서 userId: ", userId);
            try {
                const result = await apolloClient.query({
                    query: gql`
                    query($userId: String) {
                        fetchReviews(
                            findReviewsInput: {
                                userId: $userId
                            }
                        ){
                            user {
                                userId
                                userName
                            }
                            product {
                                productId
                                productName
                                files {
                                    fileName
                                    fileURL
                                }
                            }
                            reviewContent
                            rating
                            createdAt
                        }
                    }`,
                    variables: {
                        userId
                    },
                    fetchPolicy: 'no-cache',
                })
                return result.data.fetchReviews;
            } catch (error) {
                throw new Error(error.message);
            }
        },

        async reviewDelete(_, productId) {
            try {
                await apolloClient.mutate({
                    mutation: gql`
                        mutation($productId: String!) {
                            deleteReview(deleteReviewInput: {
                                productId: $productId
                            })
                        }
                    `,
                    variables: {
                        productId
                    }
                });
            } catch (error) {
                throw new Error(error.message);
            }
        }
    },
});

export { store, apolloClient };