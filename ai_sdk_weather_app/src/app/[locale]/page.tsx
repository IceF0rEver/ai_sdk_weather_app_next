import Link from "next/link";
import { Button } from "@/components/ui/button";
import DarkMode from "@/components/utils/dark-mode";
import SelectLang from "@/components/utils/select-lang";
import { getI18n } from "@/locales/server";

export default async function HeroPage() {
	const t = await getI18n();

	return (
		<div className="flex flex-col justify-center items-center h-screen gap-4">
			<div className="flex gap-2">
				<Link href="/auth/register">
					<Button size="lg" className="shadow-md">
						{t("button.register")}
					</Button>
				</Link>
				<Link href="/auth/login">
					<Button size="lg" className="shadow-md" variant="secondary">
						{t("button.login")}
					</Button>
				</Link>
			</div>
			<div className="flex gap-2">
				<SelectLang />
				<DarkMode />
			</div>
		</div>
	);
}
