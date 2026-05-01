import {Layout} from "@/components/Layout";
import {VaerkGrid} from "@/components/VaerkGrid";

export default function UdforskSide() {
    return (
        <Layout mainClass="flex-1 p-6 max-w-7xl mx-auto w-full">
            <h1 className="text-2xl font-bold mb-6">Udforsk</h1>
            <VaerkGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"/>
        </Layout>
    );
}