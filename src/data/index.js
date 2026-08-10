export const NAV_LINKS = ["Services", "Projects", "About"];

export const PARTNERS = [
  { name: "52 SHUTIQ",          logo: "/clients/52-shutiq-logo.png" },
  { name: "AMINU",              logo: "/clients/aminu-logo.png" },
  { name: "ARVIEND SUD",        logo: "/clients/arviend-sud-logo.png" },
  { name: "BATRAA",             logo: "/clients/batraa-logo.png" },
  { name: "KIO",                logo: "/clients/kio-logo.png" },
  { name: "LAMCON",             logo: "/clients/lamcon-logo.png" },
  { name: "MANIPAL UNIVERSITY", logo: "/clients/manipal-university-logo.png" },
  { name: "NOBLE MISFIT",       logo: "/clients/noble-mistift-logo.png" },
  { name: "ORACLE",             logo: "/clients/oracle-logo.png" },
  { name: "SALT",               logo: "/clients/salt-logo.png" },
  { name: "SUCESS GYAN",        logo: "/clients/sucess-gyan-logo.png" },
  { name: "SWIGGY",             logo: "/clients/swiggy-logo.png" },
  { name: "UV",                 logo: "/clients/uv-logo.png" },
];

export const SERVICES = [
  {
    num: "01",
    title: "Web Design",
    desc: "Websites That Do The Selling. We Design And Build Conversion-Focused Experiences That Reflect Your Brand At Its Best.",
    tags: ["UI DESIGN"],
  },
  {
    num: "02",
    title: "Development",
    desc: "Every Brand With A Story Deserves A Platform To Tell It. With Fans Who Listen To Your Story. Realized By Experts With One Shared Passion: Creating Digital Things.",
    tags: ["DEVELOPMENT"],
  },
  {
    num: "03",
    title: "Video Production",
    desc: "Brand Films, Product Launches, Campaign Content. We Shoot, Edit, And Deliver Stories That Move People — And Algorithms.",
    tags: ["VIDEO PRODUCTION"],
  },
  {
    num: "04",
    title: "Performance Creatives",
    desc: "From scroll-stopping ads to high-converting campaign assets, we create performance-led visuals backed by insights, iteration, and continuous optimization.",
    tags: ["PERFORMANCE"],
  },
];

export const PROJECTS = [
  {
    id: "01",
    title: "AMINU",
    desc: "Every Brand With A Story Deserves A Platform To Tell It.",
    tags: ["01 RETAIL & BRAND"],
    image: "/projects/aminu.png",
    gradient: "from-emerald-950 via-rose-950 to-neutral-950",
    slug: "aminu",
  },
  {
    id: "02",
    title: "ULTRAVIOLETTE",
    desc: "Cinematic portal experience with fluid physics overlays.",
    tags: ["02 RETAIL & BRAND"],
    image: "/case-work.png",
    gradient: "from-[#0a2f1d] via-[#103a20] to-[#0a1e12]",
    hideOverlay: true,
  },
];

// Two explicit columns — the left column is wider than the right.
// `ratio` is the rendered aspect ratio of each tile (media is object-cover cropped to it).
export const WORK_GALLERY = {
  left: [
    {
      type: "video", src: "/landing%20projects/salt.mp4", ratio: "16 / 10",
      tag: "Salt Oral Care - Oral Care", href: "https://saltoralcare.com/",
      title: "Video Production", subtitle: "Video Production",
    },
    {
      type: "image", src: "/landing%20projects/tann-trim.png", ratio: "7 / 6",
      tag: "Tanntrim - Fashion", href: "https://www.tanntrim.com/",
      title: "Video Production", subtitle: "Video Production",
    },
    {
      type: "video", src: "/landing%20projects/carbonado.mp4", ratio: "2 / 1",
      tag: "Carbonado - Travel", href: "https://www.thecarbonado.com",
      title: "Video Production", subtitle: "Video Production",
    },
  ],
  right: [
    {
      type: "image", src: "/landing%20projects/ultraviolette.png", ratio: "5 / 7",
      tag: "UV Airspace - Automotive", href: "https://airspace.ultraviolette.com/",
      title: "Video Production", subtitle: "Video Production",
    },
    {
      type: "image", src: "/landing%20projects/aminu.png", ratio: "5 / 7",
      tag: "Aminu - Skincare", href: "https://www.aminu.life/",
      title: "Video Production", subtitle: "Video Production",
    },
  ],
};

export const SHOWREEL = [
  { label: "METRO CASH & CARRY — DIWALI CAMPAIGN FILM", video: "/videos/video 1.mp4", num: "01" },
  { label: "PASCAL SERO — ORACLE",                      video: "/videos/video 2.mp4", num: "02" },
  { label: "MANIPAL UNIVERSITY",                        video: "/videos/video 3.mp4", num: "03" },
];
