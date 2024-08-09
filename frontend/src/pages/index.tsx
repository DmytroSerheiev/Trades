import Layout from "@/components/layout";
import PnlComponent from "@/components/pnlComponent";
import { ReactElement } from "react";

export default function Home() {
  return <PnlComponent />;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageTitle="Pnl.Green">{page}</Layout>;
};
