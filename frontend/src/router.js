import { createWebHistory, createRouter } from "vue-router";
import categoryComponent from "./components/categoryComponent";
import detailComponent from "./components/detailComponent";
import cartComponent from "./components/cartComponent";
import buyComponent from "./components/buyComponent"
import orderListComponent from "./components/orderListComponent";
import reviewComponent from "./components/reviewComponent";

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
}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;