import { redirect, RedirectType } from "next/navigation";

export default function Home() {
  return redirect("/expenses", RedirectType.replace);
}
