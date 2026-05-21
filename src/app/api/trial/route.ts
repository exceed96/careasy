import { NextResponse } from 'next/server';

type TrialRequestBody = {
  contact?: string;
  contactType?: 'email' | 'phone' | 'unknown';
  age?: string;
  gender?: string;
  source?: string;
  pageUrl?: string;
  referrer?: string;
  utm?: Record<string, string>;
};

const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;

/**
 * 전화번호 또는 이메일이 들어왔는지 검증합니다.
 * 이메일은 간단한 email regex, 전화번호는 숫자 9자리 이상을 기준으로 봅니다.
 */
function getContactType(contact: string): 'email' | 'phone' | 'unknown' {
  const trimmedContact = contact.trim();
  const digitOnly = trimmedContact.replace(/\D/g, '');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(trimmedContact)) {
    return 'email';
  }

  if (digitOnly.length >= 9 && digitOnly.length <= 11) {
    return 'phone';
  }

  return 'unknown';
}

/**
 * Firebase Realtime Database REST API에 저장할 수 있도록 URL을 정리합니다.
 */
function createFirebaseEndpoint() {
  if (!FIREBASE_DATABASE_URL) {
    return null;
  }

  const normalizedUrl = FIREBASE_DATABASE_URL.replace(/\/$/, '');

  return `${normalizedUrl}/careeasyTrialLeads.json`;
}

/**
 * 무료 체험 신청 정보를 Firebase Realtime Database에 저장합니다.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrialRequestBody;
    const contact = body.contact?.trim() ?? '';
    const contactType = getContactType(contact);

    if (!contact) {
      return NextResponse.json(
        { ok: false, message: '전화번호 또는 이메일을 입력해 주세요.' },
        { status: 400 },
      );
    }

    if (contactType === 'unknown') {
      return NextResponse.json(
        {
          ok: false,
          message: '전화번호 또는 이메일 형식으로 입력해 주세요.',
        },
        { status: 400 },
      );
    }

    const firebaseEndpoint = createFirebaseEndpoint();

    if (!firebaseEndpoint) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Firebase URL이 설정되지 않았습니다.',
        },
        { status: 500 },
      );
    }

    const userAgent = request.headers.get('user-agent') ?? '';
    const referer = request.headers.get('referer') ?? '';

    const payload = {
      contact,
      contactType,
      age: body.age ?? '',
      gender: body.gender ?? '',
      source: body.source ?? 'unknown',
      pageUrl: body.pageUrl ?? '',
      referrer: body.referrer ?? referer,
      utm: body.utm ?? {},
      userAgent,
      createdAt: new Date().toISOString(),
    };

    const firebaseResponse = await fetch(firebaseEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!firebaseResponse.ok) {
      const errorText = await firebaseResponse.text();

      return NextResponse.json(
        {
          ok: false,
          message: 'Firebase 저장에 실패했습니다.',
          detail: errorText,
        },
        { status: 500 },
      );
    }

    const firebaseResult = (await firebaseResponse.json()) as { name?: string };

    return NextResponse.json({
      ok: true,
      id: firebaseResult.name ?? null,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: '무료 체험 신청 처리 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}