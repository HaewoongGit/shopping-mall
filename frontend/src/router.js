import { createWebHistory, createRouter } from "vue-router";
import categoryComponent from "./components/categoryComponent";
import detailComponent from "./components/detailComponent";
import cartComponent from "./components/cartComponent";
import buyComponent from "./components/buyComponent"
import orderListComponent from "./components/orderListComponent";
import reviewComponent from "./components/reviewComponent";
import createProductComponent from "./components/createProductComponent";
import updateProductComponent from "./components/updateProductComponent";
import myInformationComponent from "./components/myInformationComponent";
import UserInfoComponent from "./components/UserInfoComponent";
import RegisteredProductsComponent from "./components/RegisteredProductsComponent";
import RegisteredReviewsComponent from "./components/RegisteredReviewsComponent";
import updateReviewComponent from "./components/updateReviewComponent";

const routes = [{
    path: "/",
    component: categoryComponent,
},
{
    path: '/detail/:productId',
    component: detailComponent,
},
{
    path: "/cart",
    component: cartComponent
},
{
    path: "/buy",
    component: buyComponent
},
{
    path: "/orderList",
    component: orderListComponent
},
{
    path: "/review",
    component: reviewComponent
},
{
    path: "/createProduct",
    component: createProductComponent
},
{
    path: "/my-info",
    component: myInformationComponent,
    children: [{
        path: "/userInfo",
        component: UserInfoComponent
    },
    {
        path: "/registeredProducts",
        component: RegisteredProductsComponent
    },
    {
        path: "/registeredReviews",
        component: RegisteredReviewsComponent
    },
    {
        path: "/updateProduct",
        component: updateProductComponent
    },
    {
        path: "/updateReview",
        component: updateReviewComponent
    }
    ]
}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;