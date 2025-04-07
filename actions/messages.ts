"use server";

export async function sayHello(_:any,data: FormData) {
  const name = data.get("name")?.toString() || "Stranger";

  console.log(`Hello, ${name}!`);

  return { message: `Hello, ${name}!` };
}
