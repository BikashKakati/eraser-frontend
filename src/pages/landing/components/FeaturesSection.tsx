import { NodeIcon, ConnectionIcon, GroupingIcon, EditIcon } from "../../../components/icons/FeatureIcons";
import { Card } from "../../../components/common/Card";

export function FeaturesSection() {
    const features = [
        { icon: NodeIcon, title: "Visual Logic", desc: "Build node-based architectures lightning fast." },
        { icon: ConnectionIcon, title: "Smart Routing", desc: "Arrows snap perfectly and route intelligently." },
        { icon: GroupingIcon, title: "Structured Thinking", desc: "Nest groups to organize complex sub-systems." },
        { icon: EditIcon, title: "Fluid Editing", desc: "Dynamically resizing elements and inline text." }
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
                <p className="text-slate-400">Everything you need to map out your ideas.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, i) => (
                    <Card key={i} hoverEffect={true} className="p-6 group">
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform group-hover:text-indigo-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </Card>
                ))}
            </div>
        </section>
    );
}
