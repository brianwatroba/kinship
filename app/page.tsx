"use client";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

export default function Index() {
  // const supabase = createServerComponentClient({ cookies });
  const [supabase] = useState(() => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!));

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  const signUp = async () => {
    let { error } = await supabase.auth.signUp({
      phone: "+15555555",
      password: "some-password",
    });
  };

  return (
    <div>
      <form action={signUp}>
        <label>
          Phone Number:
          <input type="text" />
        </label>
        <button type="submit" onClick={signUp}>
          Submit
        </button>
      </form>
    </div>
  );
}
