// This does not update when you switch the language
// import { i18n } from "src/boot/i18n";
// const { t } = i18n;

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "landing",
        component: () => import("pages/Index.vue")
      },
      {
        path: "/documents",
        name: "documents",
        component: () => import("pages/Documents.vue")
      },
      {
        path: "/reset-password",
        name: "ResetPassword",
        component: () => import("pages/ResetPassword.vue")
      },
      {
        path: "/impressum",
        name: "Impressum",
        component: () => import("pages/Impressum.vue")
      },
      {
        path: "/datenschutzerklaerung",
        name: "Datenschutzerklaerung",
        component: () => import("pages/Datenschutzerklaerung.vue")
      }
    ]
  },
  {
    path: "/review/:token",
    component: () => import("layouts/ReviewLayout.vue"),
    children: [
      {
        path: "",
        name: "ReviewProject",
        component: () => import("pages/ReviewProject.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("pages/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("pages/Register.vue")
  },
  {
    path: "/dashboard",
    component: () => import("layouts/dashboardLayout.vue"),
    children: [
      {
        path: "/dashboard",
        name: "Home",
        meta: {
          title: "home",
          titleDE: "home",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Home.svg",
        component: () => import("pages/dashboard/Home.vue")
      },
      {
        path: "/project/dashboard",
        name: "ProjectDashboard",
        meta: {
          title: "Project Dashboard",
          titleDE: "Projekte Dashboard",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Documents.svg",
        component: () => import("pages/dashboard/ProjectDashboard.vue")
      },
      {
        path: "/overview",
        name: "DataOverview",
        meta: {
          title: "Data Overview",
          titleDE: "Datenübersicht",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Documents.svg",
        component: () => import("pages/dashboard/DataOverview.vue")
      },
      {
        path: "/watchlist",
        name: "watchlist",
        meta: {
          title: "My Watchlist",
          titleDE: "Meine Merklisten",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Favorite.svg",
        children: [
          {
            path: "/watchlist/projectIdeas",
            name: "projectIdeas",
            meta: {
              title: "projectIdeas",
              titleDE: "Projekt Idee",
              requireAuth: true,
              requireAdmin: true
            },
            icon: "/icons/Home.svg"
          }
        ],
        component: () => import("pages/dashboard/Watchlist.vue")
      },
      {
        path: "/catkeytags",
        name: "CatKeyTags",
        meta: {
          title: "Categories & Keywords/Tags",
          titleDE: "Kategorien & Schlagwörter",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Hash.svg",
        component: () => import("src/pages/dashboard/CategoriesKeywords.vue")
      },
      {
        path: "/Administation/User",
        name: "AdministationUser",
        meta: {
          title: "User Administration",
          titleDE: "Benutzer*innen-Verwaltung",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Users.svg",
        component: () => import("pages/dashboard/AdminUser.vue")
      },
      {
        path: "/Administation/User/:id",
        name: "AdministationUserDetails",
        meta: {
          title: "User Administation",
          titleDE: "Benutzer*innen-Verwaltung",
          showInNavigation: false,
          backLink: "/Administation/User",
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Users.svg",
        component: () => import("pages/dashboard/DetailUser.vue")
      },
      {
        path: "/network",
        name: "Network",
        meta: {
          title: "My Network",
          titleDE: "Mein Netzwerk",
          showInNavigation: false,
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Network.svg",
        component: () => import("pages/dashboard/Network.vue")
      },
      {
        path: "/network/:id",
        name: "UserData",
        meta: {
          title: "User Data",
          titleDE: "Benutzerdaten",
          showInNavigation: false,
          backLink: "/network",
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Users.svg",
        component: () => import("pages/dashboard/NetworkUser.vue")
      },
      {
        path: "/email-center",
        name: "EmailCenter",
        meta: {
          title: "Email Center",
          titleDE: "E-Mail-Zentrum",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Document.svg",
        component: () => import("pages/dashboard/EmailCenter.vue")
      },
      {
        path: "/federal-states",
        name: "FederalStates",
        meta: {
          title: "Federal States",
          titleDE: "Bundesländer",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Government.svg",
        component: () => import("pages/dashboard/FederalStates.vue")
      },
      {
        path: "/landkreise",
        name: "Landkreise",
        meta: {
          title: "Landkreise",
          titleDE: "Landkreise",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Government.svg",
        component: () => import("pages/dashboard/Landkreise.vue")
      },
      {
        path: "/Administation/Areas",
        name: "AdministationAreas",
        meta: {
          title: "Administrative areas",
          titleDE: "Verwaltungsbereiche",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: false,
          isGuest: true
        },
        icon: "/icons/Municipality.svg",
        component: () => import("pages/dashboard/Municipality.vue")
      },
      {
        path: "/states",
        name: "States",
        meta: {
          title: "States",
          titleDE: "Gemeinden",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Government.svg",
        component: () => import("pages/dashboard/States.vue")
      },
      {
        path: "/Administation/Areas/:id",
        name: "AdministationAreasDetails",
        meta: {
          title: "Details for the Administration",
          titleDE: "Details für die Verwaltung",
          backLink: "/Administation/Areas",
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Municipality.svg",
        component: () => import("pages/dashboard/MunicipalityDetail.vue")
      },
      {
        path: "/stats",
        name: "Statistics&Archive",
        meta: {
          title: "Statistics & Archive",
          titleDE: "Statistik & Archiv",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Archive.svg",
        component: () => import("pages/dashboard/Stats.vue")
      },
      {
        path: "/translations",
        name: "translations",
        meta: {
          title: "Translations",
          titleDE: "Translations",
          showInNavigation: true,
          requireAuth: true,
          requireAdmin: true
        },
        icon: "/icons/Archive.svg",
        component: () => import("pages/dashboard/Translations.vue")
      },
      {
        path: "/application/process/",
        name: "ApplicationProcess",
        meta: {
          title: "Project Dashboard",
          titleDE: "Projekt Dashboard",
          showInNavigation: false,
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Documents.svg",
        component: () => import("pages/dashboard/ApplicationProcess.vue")
      },
      {
        path: "/application/process/edit/:projectId",
        name: "EditApplicationProcess",
        meta: {
          title: "Edit Project Dashboard",
          titleDE: "Edit Projekt Dashboard",
          showInNavigation: false,
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Documents.svg",
        component: () => import("pages/dashboard/ApplicationProcess.vue")
      },
      {
        path: "/application/process/view/:projectId",
        name: "ViewApplicationProcess",
        meta: {
          title: "Details of the project Idea",
          titleDE: "Details zur Projektidee",
          backLink: "/user/data",
          requireAuth: true,
          requireAdmin: false
        },
        component: () => import("pages/dashboard/ProjectView.vue")
      },
    ]
  },
  {
    path: "/user",
    component: () => import("layouts/dashboardLayout.vue"),
    children: [
      {
        path: "/user/notifications",
        name: "notifications",
        meta: {
          title: "Notifications",
          titleDE: "Benachrichtigungen",
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Home.svg",
        component: () => import("pages/dashboard/Notifications.vue")
      },
      {
        path: "/user/data",
        name: "MyData",
        meta: {
          title: "My Data",
          titleDE: "Meine Daten",
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Home.svg",
        component: () => import("pages/dashboard/MyData.vue")
      },
      {
        path: "/community/data",
        name: "CommunityData",
        meta: {
          title: "My Community Data",
          titleDE: "Meine Gemeinschaftsdaten",
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Home.svg",
        component: () => import("pages/dashboard/CommunityData.vue")
      },
      {
        path: "/user/settings",
        name: "settings",
        meta: {
          title: "Settings",
          titleDE: "Einstellungen",
          requireAuth: true,
          requireAdmin: false
        },
        icon: "/icons/Settings.svg",
        component: () => import("pages/dashboard/Settings.vue")
      },
      {
        path: "/user/newProjectIdea",
        name: "NewProjectIdea",
        meta: {
          title: "New Project Ideas",
          titleDE: "Neue Projektideen",
          backLink: "/user/data",
          requireAuth: true,
          requireAdmin: false
        },
        component: () => import("pages/dashboard/NewProjectIdea.vue")
      },
      {
        path: "/user/newProjectIdea/edit/:id",
        name: "EditProject",
        meta: {
          title: "Edit project Idea",
          titleDE: "Projektidee bearbeiten",
          backLink: "/user/data",
          requireAuth: true,
          requireAdmin: false
        },
        component: () => import("pages/dashboard/NewProjectIdea.vue")
      },
      {
        path: "/user/newProjectIdea/:id",
        name: "ViewProject",
        meta: {
          title: "Details of the project Idea",
          titleDE: "Details zur Projektidee",
          backLink: "/user/data",
          requireAuth: true,
          requireAdmin: false
        },
        component: () => import("pages/dashboard/ProjectView.vue")
      },
      {
        path: "/user/newFunding",
        name: "NewFunding",
        meta: {
          title: "New Funding",
          titleDE: "Neue Fördermittel",
          backLink: "/user/data",
          requireAuth: true,
          requireAdmin: false
        },
        component: () => import("pages/dashboard/NewFunding.vue")
      },
      {
        path: "/user/newFunding/edit/:id",
        name: "EditFunding",
        meta: {
          title: "Edit Funding",
          titleDE: "Fördermittel bearbeiten",
          backLink: "/user/data",
          requireAuth: true,
          requireAdmin: false
        },
        component: () => import("pages/dashboard/NewFunding.vue")
      },
      {
        path: "/user/newFunding/:id",
        name: "ViewFunding",
        meta: {
          title: "Details of the Funding",
          titleDE: "Einzelheiten der Fördermittel",
          backLink: "/user/data",
          requireAuth: true,
          requireAdmin: false
        },
        component: () => import("pages/dashboard/FundingView.vue")
      }
    ]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  }
];

export default routes;
