import {Layout} from "@/components/Layout";
import {OprettelseForm} from "@/components/blocks/OprettelseForm.tsx"

export function OpretningsSide() {
    return (
        <Layout mainClass="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-16">
            <OprettelseForm className="w-full max-w-md"/>
        </Layout>
    );
}

export default OpretningsSide;