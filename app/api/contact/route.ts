import Contact from "@/models/contact.model";
import { NextRequest, NextResponse } from "next/server";
import { databaseConnection } from "@/config/databseConnection";
import { contactConfirmationMail } from "@/services/sendMail";

export async function POST(request: NextRequest) {
  await databaseConnection();
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required", success: false },
        { status: 400 }
      );
    }
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    await contactConfirmationMail(email, name);
    return NextResponse.json(
      { message: "Contact sent successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching cart", success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  await databaseConnection();
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { contacts, success: true, message: "Contacts fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching contacts", success: false },
      { status: 500 }
    );
  }
}
