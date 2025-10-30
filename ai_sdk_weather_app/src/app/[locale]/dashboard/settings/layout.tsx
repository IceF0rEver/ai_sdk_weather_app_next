import LayoutHeader from "@/app/[locale]/dashboard/_components/layout-header";
import { getI18n } from "@/locales/server";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();
	return (
		<section className="p-6">
			<LayoutHeader
				title={t("app.dashboard.settings.layout.title")}
				description={t("app.dashboard.settings.layout.description")}
			/>
			{children}
		</section>
	);
}
