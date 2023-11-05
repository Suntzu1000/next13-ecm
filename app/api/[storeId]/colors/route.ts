import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const body = await req.json();

    const { name, value } = body;

    if (!name) {
      return new NextResponse("O nome é obrigatório", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Valor é obrigatório", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("O ID da loja é obrigatório", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Não autorizado", { status: 405 });
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLORS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("O ID da loja é obrigatório", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(colors);
  } catch (error) {
    console.log('[COLORS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
