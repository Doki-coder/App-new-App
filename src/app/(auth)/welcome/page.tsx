import WelcomeForm from '@/components/auth/welcome-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Landmark } from 'lucide-react';

export default function WelcomePage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="items-center text-center">
        <Landmark className="h-12 w-12 text-primary mb-4" />
        <CardTitle className="text-3xl font-bold">به حسابدار خوش آمدید!</CardTitle>
        <CardDescription>
          برای شروع، لطفا نام، ارز مورد استفاده و زبان برنامه را مشخص کنید.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WelcomeForm />
      </CardContent>
    </Card>
  );
}
