import { createWebHistory, createRouter } from "vue-router";
import categoryComponent from "./components/categoryComponent";
import detailComponent from "./components/detailComponent";
import cartComponent from "./components/cartComponent";
import buyComponent from "./components/buyComponent"
import orderListComponent from "./components/orderListComponent";
import reviewComponent from "./components/reviewComponent";
import createProductComponent from "./components/createProductComponent";
import myInformationComponent from "./components/myInformationComponent";
import UserInfoComponent from "./components/UserInfoComponent";
import RegisteredProductsComponent from "./components/RegisteredProductsComponent";
import RegisteredReviewsComponent from "./components/RegisteredReviewsComponent";

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
        path: "/user-info",
        component: UserInfoComponent
    },
    {
        path: "/registered-products",
        component: RegisteredProductsComponent
    },
    {
        path: "/registered-reviews",
        component: RegisteredReviewsComponent
    }
    ]
}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;