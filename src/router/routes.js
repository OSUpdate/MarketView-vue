const Login = () => import('pages/user/Login')
const SignUp = () => import('pages/user/SignUp')
const SignIn = () => import('pages/user/SignIn')

const Markets = () => import('pages/user/Markets')

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        name: "login",
        path: "/login",
        component: Login,
        meta: { requiresAuth: false },
        props: true,
      },
      {
        name: "signUp",
        path: "/signup",
        component: SignUp,
        meta: { requiresAuth: false },
        props: true,
      },
      {
        name: "signin",
        path: "/signin",
        component: SignIn,
        meta: { requiresAuth: false },
        props: true,
      },
      {
        name: "markets",
        path: "/markets",
        component: Markets,
        meta: { requiresAuth: false },
        props: true,
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
