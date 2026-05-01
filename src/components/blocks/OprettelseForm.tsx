"use client";
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
import {Checkbox} from "@/components/ui/checkbox"
import {Link, useNavigate} from "react-router-dom"
import {useState, useRef} from "react";
import {authClient} from "@/lib/auth-client.ts";
import {toast} from "sonner"
import {UserPlus, LoaderCircle, Eye, EyeOff} from "lucide-react"
import HCaptcha from "@hcaptcha/react-hcaptcha";

export function OprettelseForm({...props}: React.ComponentProps<typeof Card>) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [captchaToken, setCaptchaToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const captchaRef = useRef<HCaptcha>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // tjekker om terms and conditions er blevet accepteret
        if (!acceptedTerms) {
            toast.error("Du skal acceptere privatlivspolitikken og servicevilkårene.", {position: "top-center"});
            return;
        }

        // tjekker om koderne matcher
        if (password !== confirmPassword) {
            toast.error("Adgangskoderne matcher ikke.", {position: "top-center"});
            return;
        }

        // tjekker om captchaen er løst
        if (!captchaToken) {
            toast.error("Bekræft venligst at du ikke er en robot.", {position: "top-center"});
            return;
        }

        setLoading(true);

        const {error, data} = await authClient.signUp.email({
            name,
            email,
            password,
            fetchOptions: {
                headers: {
                    "x-captcha-response": captchaToken,
                },
            },
        });

        if (!error) {
            toast.success("Din konto er nu oprettet.", {position: "top-center"});
            navigate(`/profil/${data?.user.id}`);
        } else {
            toast.error("Oprettelse mislykkedes. Prøv igen.", {position: "top-center"});
            captchaRef.current?.resetCaptcha();
            setCaptchaToken("");
            setLoading(false);
        }
    };

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Opret en konto</CardTitle>
                <CardDescription>
                    Indtast dine oplysninger nedenfor for at oprette en konto
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Navn</FieldLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={100}
                                required
                            />
                        </Field>
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
                            <FieldLabel htmlFor="password">Adgangskode</FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 tegn"
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
                        <Field>
                            <FieldLabel htmlFor="confirm-password">
                                Bekræft adgangskode
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Gentag din adgangskode"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                                </button>
                            </div>
                        </Field>
                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="terms"
                                className="cursor-pointer"
                                checked={acceptedTerms}
                                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                            />
                            <label htmlFor="terms" className="text-sm cursor-pointer leading-tight">
                                Jeg accepterer{" "}
                                <Link to="/privatlivspolitik" target="_blank" rel="noopener noreferrer"
                                      className="cursor-pointer underline underline-offset-4 hover:text-primary">
                                    privatlivspolitikken
                                </Link>{" "}
                                og{" "}
                                <Link to="/servicevilkaar" target="_blank" rel="noopener noreferrer"
                                      className="cursor-pointer underline underline-offset-4 hover:text-primary">
                                    servicevilkårene
                                </Link>
                            </label>
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
                        <FieldGroup>
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <LoaderCircle className="size-4 animate-spin"/> :
                                        <UserPlus className="size-4"/>}
                                    Opret Konto
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    Har du allerede en konto? <Link to="/login">Log ind</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}