import { EmailService, emailService, SendEmailResult } from '../emailService';

type SupabaseQuery = {
  select: jest.Mock<any, any>;
  eq: jest.Mock<any, any>;
  order?: jest.Mock<any, any>;
  limit?: jest.Mock<any, any>;
  single?: jest.Mock<any, any>;
  maybeSingle?: jest.Mock<any, any>;
};

const createPreferenceQuery = (data: any): SupabaseQuery => {
  const query: SupabaseQuery = {
    select: jest.fn().mockImplementation(() => query),
    eq: jest.fn().mockImplementation(() => query),
    maybeSingle: jest.fn().mockResolvedValue({ data, error: null }),
  };
  return query;
};

const createTemplateQuery = (data: any): SupabaseQuery => {
  const query: SupabaseQuery = {
    select: jest.fn().mockImplementation(() => query),
    eq: jest.fn().mockImplementation(() => query),
    order: jest.fn().mockImplementation(() => query),
    limit: jest.fn().mockImplementation(() => query),
    single: jest.fn().mockResolvedValue({ data, error: null }),
  };
  return query;
};

const createSupabaseStub = (options: {
  preferenceData: any;
  templateData?: any;
}) => {
  const preferenceQuery = createPreferenceQuery(options.preferenceData);
  const templateQuery = options.templateData
    ? createTemplateQuery(options.templateData)
    : null;

  return {
    from: jest.fn((table: string) => {
      if (table === 'email_preferences') {
        return preferenceQuery;
      }
      if (table === 'email_templates') {
        if (!templateQuery) {
          throw new Error('Template query not expected');
        }
        return templateQuery;
      }
      throw new Error(`Unexpected table query: ${table}`);
    }),
  };
};

beforeAll(() => {
  EmailService.configure({
    lambdaUrl: 'https://example.com/lambda',
    fromEmail: 'no-reply@example.com',
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('EmailService preference handling', () => {
  it('skips email when user has email disabled', async () => {
    const supabase = createSupabaseStub({
      preferenceData: { email_enabled: false },
    });

    const result = await emailService.sendEmailFromTemplate(
      'lesson_reminder',
      'user@example.com',
      {},
      supabase,
      { userId: 'user-123' }
    );

    expect(result.skipped).toBe(true);
    expect(result.success).toBe(false);
    expect(result.skipReason).toBe('email_disabled');
    expect(supabase.from).toHaveBeenCalledWith('email_preferences');
    expect(supabase.from).not.toHaveBeenCalledWith('email_templates');
  });

  it('sends email when preferences allow and template exists', async () => {
    const supabase = createSupabaseStub({
      preferenceData: {
        email_enabled: true,
        types: {
          lesson_reminder: { email: true },
        },
      },
      templateData: {
        subject_template: 'Hello {{user_name}}',
        html_body_template: '<p>Body</p>',
        text_body_template: 'Body',
      },
    });

    const sendEmailSpy = jest
      .spyOn(emailService as EmailService, 'sendEmail')
      .mockResolvedValue({
        success: true,
        messageId: 'abc123',
      } as SendEmailResult);

    const result = await emailService.sendEmailFromTemplate(
      'lesson_reminder',
      'user@example.com',
      { user_name: 'Naresh' },
      supabase,
      { userId: 'user-123' }
    );

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('abc123');
    expect(result.skipped).toBeFalsy();
    expect(supabase.from).toHaveBeenCalledWith('email_preferences');
    expect(supabase.from).toHaveBeenCalledWith('email_templates');
    expect(sendEmailSpy).toHaveBeenCalledTimes(1);

    const [emailPayload] = sendEmailSpy.mock.calls[0];
    expect(emailPayload.subject).toBe('Hello Naresh');
  });
});

