import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import AuthoriseView from '../views/AuthoriseView.vue'
import { useSpotifyStore } from '@/stores/spotify'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => {
        const spotifyStore = useSpotifyStore()
        if (spotifyStore.authenticated) next()
        else next({ path: '/authorise', query: to.query })
      },
      component: HomeView
    },
    {
      path: '/authorise',
      name: 'authorise',
      component: AuthoriseView,
      beforeEnter: (to, from, next) => {
        const spotifyStore = useSpotifyStore()
        if (!spotifyStore.authenticated) next()
        else next(from)
      }
    },
    {
      path: '/settings',
      name: 'settings',
      beforeEnter: (to, from, next) => {
        const spotifyStore = useSpotifyStore()
        if (spotifyStore.authenticated) next()
        else next('/authorise')
      },
      component: SettingsView
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () => import('../views/SettingsView.vue')
    }
  ]
})

export default router
