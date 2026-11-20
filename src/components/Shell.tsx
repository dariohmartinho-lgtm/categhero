"use client";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { signIn, signOut, usePlayer, type Player } from "@/lib/store";
import { S } from "@/strings";
import { CrownIcon } from "./Icons";

export function Header() {
  const player = usePlayer();
  return (
    <header className="top">
      <Link href="/" className="brand" aria-label={S.home}>
        <CrownIcon />
        <span>{S.appName}</span>
      </Link>
      {player && (
        <div className="who">
          <span>{player.name}</span>
          <button className="link" onClick={signOut}>
            {S.auth.switchPlayer}
          </button>
        </div>
      )}
    </header>
  );
}

/** Shows the sign-in screen until the tester has picked a name. */
export function RequirePlayer({ children }: { children: (player: Player) => ReactNode }) {
  const player = usePlayer();
  if (player === undefined) return <p className="muted">{S.loading}</p>;
  if (player === null) return <SignIn />;
  return <>{children(player)}</>;
}

export function validateName(raw: string): string | null {
  const n = raw.trim().replace(/\s+/g, " ");
  if (n.length < 2) return S.auth.nameTooShort;
  if (n.length > 24) return S.auth.nameTooLong;
  return null;
}

function SignIn() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateName(name);
    if (err) {
      setError(err);
      document.getElementById("nm")?.focus();
      return;
    }
    signIn(name);
  };
  return (
    <section className="flex flex-col gap-[18px] pt-1.5">
      <h1 className="text-[2rem]">{S.auth.title}</h1>
      <p className="muted">{S.auth.lead}</p>
      <form className="stack" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="nm">{S.auth.nameLabel}</label>
          <input
            id="nm"
            type="text"
            autoComplete="nickname"
            maxLength={24}
            placeholder={S.auth.namePlaceholder}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            aria-invalid={!!error}
            aria-describedby="er"
          />
        </div>
        <p className="err" id="er" role="alert">
          {error}
        </p>
        <button className="btn block" type="submit">
          {S.auth.submit}
        </button>
      </form>
    </section>
  );
}
