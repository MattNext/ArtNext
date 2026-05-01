"use client";
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Link, useNavigate} from "react-router-dom"
import {useState, useRef} from "react";
import {authClient} from "@/lib/auth-client.ts";
import {toast} from "sonner"
import {LogIn, LoaderCircle, Eye, EyeOff} from "lucide-react"
import {Label} from "@/components/ui/label"
import {Checkbox} from "@/components/ui/checkbox"
import HCaptcha from "@hcaptcha/react-hcaptcha";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [captchaToken, setCaptchaToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const captchaRef = useRef<HCaptcha>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // tjekker om captchaen er løst
        if (!captchaToken) {
            toast.error("Bekræft venligst at du ikke er en robot.", {position: "top-center"});
            return;
        }

        setLoading(true);

        const {data, error} = await authClient.signIn.email({
            email,
            password,
            rememberMe,
            fetchOptions: {
                headers: {
                    "x-captcha-response": captchaToken,
                },
            },
        });

        if (!error) {
            toast.success("Du er nu logget ind.", {position: "top-center"});
            navigate(`/profil/${data?.user.id}`);
        } else {
            toast.error("Login mislykkedes. Prøv igen.", {position: "top-center"});
            captchaRef.current?.resetCaptcha();
            setCaptchaToken("");
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Log ind på din konto</CardTitle>
                    <CardDescription>
                        Indtast din e-mailadresse nedenfor for at logge ind på din konto
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="hej@eksempel.dk"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Adgangskode</FieldLabel>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                                    </button>
                                </div>
                            </Field>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember-me"
                                    checked={rememberMe}
                                    className="cursor-pointer"
                                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                                />
                                <Label htmlFor="remember-me"
                                       className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Husk mig
                                </Label>
                            </div>
                            <div className="flex justify-center">
                                <HCaptcha
                                    sitekey={process.env.BUN_PUBLIC_HCAPTCHA_SITE_KEY!}
                                    onVerify={(token) => setCaptchaToken(token)}
                                    languageOverride="da"
                                    onExpire={() => setCaptchaToken("")}
                                    ref={captchaRef}
                                />
                            </div>
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <LoaderCircle className="size-4 animate-spin"/> :
                                        <LogIn className="size-4"/>}
                                    Log på
                                </Button>
                                <FieldDescription className="text-center">
                                    Har du ikke en konto? <Link to="/opret">Opret en konto</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}