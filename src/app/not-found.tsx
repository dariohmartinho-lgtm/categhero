import Link from "next/link";
import { S } from "@/strings";

export default function NotFound() {
  return (
    <section className="stack">
      <h1 className="text-[1.7rem]">{S.errors.notFound}</h1>
      <Link className="btn" href="/">
        {S.errors.backHome}
      </Link>
    </section>
  );
}
