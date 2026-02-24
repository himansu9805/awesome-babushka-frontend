import LeftSidenav from "@/components/SocialMedia/LeftSidenav/LeftSidenav";
import RightSidenav from "@/components/SocialMedia/RightSidenav/RightSidenav";
import { Outlet } from "react-router-dom";

const SocialMediaLayout = () => {
  return (
    <main className="mx-4 md:mx-20">
      {/* Left Sidebar: hidden on mobile; visible on tablet and above */}
      <aside className="hidden md:block md:fixed md:left-20 top-0 md:w-[250px]">
        <LeftSidenav />
      </aside>

      {/* Feed: full wi</aside>dth on mobile, has left margin on tablet and extra right margin on desktop */}
      <section className="md:ml-[250px] lg:mr-[300px]">
        <Outlet />
      </section>

      {/* Right Sidebar: visible on desktop only */}
      <aside className="hidden lg:block lg:fixed lg:right-20 top-0 lg:w-[300px]">
        <RightSidenav />
      </aside>
    </main>
  );
};

export default SocialMediaLayout;
