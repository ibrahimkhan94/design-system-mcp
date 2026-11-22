import { Alert, Button, Card, Stack, TextField } from '../components';

export default function SignUpCard() {
  return (
    <Card title="Create your account">
      <Stack gap="4">
        <Alert tone="danger">This email is already registered. Log in or use another email.</Alert>
        <TextField label="Full name" autoComplete="name" />
        <TextField label="Email" type="email" error="This email is already registered." />
        <TextField label="Password" type="password" hint="At least 12 characters." />
        <Button fullWidth>Create account</Button>
        <p style={{ fontSize: 'var(--ds-font-size-sm)', color: 'var(--ds-color-text-muted)', margin: '0px' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--ds-color-text-link)' }}>Log in</a>
        </p>
      </Stack>
    </Card>
  );
}
