import {Layout} from "@/components/Layout";
import {LoginForm} from "@/components/blocks/LoginForm.tsx"

export function LoginSide() {
    return (
        <Layout mainClass="flex flex-1 items-center justify-center px-4 py-8 w-full sm:px-6 sm:py-16">
            <LoginForm className="w-full max-w-md"/>
        </Layout>
    );
}

export default LoginSide;