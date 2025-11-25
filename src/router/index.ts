import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/utils/supabase';
import { createRouter, createWebHistory } from 'vue-router'

let localUser; 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Admin Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/scanner',
      name: 'Scan Tiket',
      component: () => import('../views/Others/Scanner.vue'),
      meta: {
        title: 'Scan Ticket',
        requiresAuth: true,
      },
    },
    {
      path: '/participant-datas',
      name: 'Data Peserta',
      component: () => import('../views/Tables/ParticipantDatas.vue'),
      meta: {
        title: 'Basic Tables',
        requiresAuth: true,
      },
    },
    {
      path: '/donation-datas',
      name: 'Data Infaq',
      component: () => import('../views/Tables/ParticipantDatas.vue'),
      meta: {
        title: 'Basic Tables',
        requiresAuth: true,
      },
    },
    {
      path: '/event-list',
      name: 'Daftar Event',
      component: () => import('../views/Tables/EventList.vue'),
      meta: {
        title: 'Daftar Event',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
  ],
})



async function getUser(next: (path?: string) => void): Promise<void> {
  const localUser = await supabase.auth.getSession();
  if (localUser.data.session === null) {
    next('/signin');
  } else {
    next();
  }
}

router.beforeEach((to, from, next) => {
  document.title = `Skrt ${to.meta.title} | Admin`
  const auth = useAuthStore()
  if (to.meta.requiresAuth) { 
    getUser(next);
  } else {
    next();
  }
})



export default router

