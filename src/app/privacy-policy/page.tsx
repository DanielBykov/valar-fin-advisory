import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Valar Financial Advisors",
  description:
    "Read the privacy policy for Valar Financial Advisors — how we collect, use and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    images: ["/opengraph.jpg"],
    title: "Privacy Policy | Valar Financial Advisors",
    description:
      "How Valar Financial Advisors collects, uses and protects your personal information.",
    url: "/privacy-policy",
    type: "website",
  },
};

const linkClass = "text-valar-amber hover:underline font-medium";

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-valar-amber flex-shrink-0 mt-2" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-valar-navy mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

const AdminEmail = () => (
  <a href="mailto:admin@valar.co.nz" className={linkClass}>admin@valar.co.nz</a>
);

/*
 * Source: Valar's "Privacy Policy website" document (Jul26), verbatim apart from
 * three changes Lena agreed on 2026-09-14: the Privacy Officer and access
 * requests go to admin@ (the document had lena.bykova@ and info@), a stray
 * address line is removed, and the older site-only list (Calendly, deletion) is
 * dropped in favour of the document's own wording.
 */
export default function PrivacyPolicyPage() {
  return (
    <div data-cmp="PrivacyPolicyPage" className="w-full flex flex-col bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-valar-navy text-white pt-28 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="h-[2px] w-6 bg-valar-amber mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy<span className="text-valar-amber">.</span>
          </h1>
          <p className="text-valar-lilac font-light">Last updated: September 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-10 text-valar-indigo leading-relaxed">

          <Section title="Introduction">
            <p className="font-semibold text-valar-navy">
              Valar Financial Advisors Limited · Financial Advice Provider · FSP1012862
            </p>
            <p>
              Valar Financial Advisors Limited (we, us, our) complies with the New Zealand Privacy Act 2020 (the
              Act) when dealing with personal information. Personal information is information about an
              identifiable individual (a natural person). This policy sets out how we will collect, use, disclose,
              and protect your personal information.
            </p>
            <p>
              This policy does not limit or exclude any of your rights under the Act. If you wish to seek further
              information on the Act, you can contact our Privacy Officer by email at <AdminEmail />, or visit{" "}
              <a href="https://www.privacy.org.nz" target="_blank" rel="noopener noreferrer" className={linkClass}>
                privacy.org.nz
              </a>{" "}
              for further information.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may change this policy by uploading a revised policy onto the website. The change will apply from
              the date that we upload the revised policy.
            </p>
          </Section>

          <Section title="What is personal information?">
            <p>
              Personal information is information about an identifiable individual. It includes (but is not
              limited to) name, address, contact details, date of birth, occupations, payment details, employment
              history and/or details, education and qualifications, financial information, testimonials and
              feedback, evidence of source of funds or source of wealth (in some cases) and other information.
            </p>
          </Section>

          <Section title="Third party collection of information">
            <p>
              Where we collect your personal information from someone other than you, we will take reasonable steps
              to notify you that we have collected your personal information, the purpose of the collection, the
              intended recipients of the information, the name and address of the agency collecting and holding the
              information, whether the collection is authorised or required by law and, if so, the law that
              authorises or requires the collection, and your right to access and request correction of that
              information, unless an exception applies under the Privacy Act 2020.
            </p>
          </Section>

          <Section title="How we use your personal information">
            <p>We will use your personal information:</p>
            <Bullets
              items={[
                "To verify your identity.",
                "To provide services and products to you.",
                "To market our services and products to you, including contacting you electronically (e.g. by call, text, or email for this purpose).",
                "To improve the services and products that we provide to you.",
                "To respond to communications from you, including a complaint.",
                "To protect and/or enforce our legal rights and interests, including defending any claim.",
                "For any other purpose authorised by you or the Act.",
              ]}
            />
          </Section>

          <Section title="Disclosing your personal information">
            <p>We may disclose your personal information to:</p>
            <Bullets
              items={[
                "Other companies or individuals who assist us in providing services or who perform functions on our behalf (such as mailing houses, hosting and data storage providers, specialist consultants, and legal advisers);",
                "Product providers (such as but not limited to lenders and insurance companies);",
                "Financial advisers and financial advice providers who may use our services;",
                "Other companies or individuals who perform checks (such as but not limited to compliance reviews and audits) that are necessary or desirable under the law on our behalf;",
                "Other companies, agencies, or individuals that maintain databases against which your identity may be verified, which may include (but are not limited to) the New Zealand Department of Internal Affairs, and New Zealand Transport Agency;",
                "Social media sites on which we may have a presence;",
                "Courts, tribunals, and regulatory authorities (such as the Financial Markets Authority, and the Ministry of Justice in New Zealand);",
                "Office of the Ombudsman, where a complaint relates to official information;",
                "Any person or agency we believe could assist in responding to a serious privacy breach;",
                "Office of the New Zealand Privacy Commissioner, where a complaint relates to breach of the Privacy Act 2020;",
                "Human Rights Commission, where a complaint relates to discrimination;",
                "CERT NZ, where appropriate to assist with the management of a voluntarily notified privacy breach;",
                "Overseas privacy regulator, where a complaint relates to the actions of an overseas agency; and",
                "Anyone else to whom you authorise us to disclose it.",
              ]}
            />
            <p>
              Except as described above, we will not disclose your personal information without your written or
              oral consent, unless we are required to do so by applicable law.
            </p>
          </Section>

          <Section title="Protecting your personal information">
            <p>
              We will take reasonable steps to keep your personal information safe from loss, unauthorised
              activity, or other misuse. Our software is subject to audits to ensure it is continuing to meet
              security requirements. All data handled in our software is encrypted in transit and during storage
              and can only be accessed over secure network connections.
            </p>
          </Section>

          <Section title="Storing your personal information">
            <p>
              We will only retain personal information as long as it is required for the purposes for which the
              information may lawfully be used. All data stored online is backed up and can be retrieved in the
              event of data loss or corruption.
            </p>
            <p>
              Data will sometimes be held on-premise at 28 Constellation Drive, Rosedale, Auckland 0632 if it is
              provided to us outside of our software.
            </p>
          </Section>

          <Section title="Accessing and correcting your personal information">
            <p>
              Subject to certain grounds for refusal set out in the Act, you have the right to access your readily
              retrievable personal information that we hold and to request a correction to your personal
              information. Before you exercise this right, we will need evidence to confirm that you are the
              individual to whom the personal information relates.
            </p>
            <p>
              In respect of a request for correction, if we think the correction is reasonable and we are reasonably
              able to change the personal information, we will make the correction. If we do not make the
              correction, we will take reasonable steps to note the personal information that you requested the
              correction.
            </p>
            <p>
              If you want to exercise either of the above rights, email us at <AdminEmail />. Your email should
              provide evidence of who you are and set out the details of your request (e.g. the personal
              information, or the correction, that you are requesting).
            </p>
          </Section>

          <Section title="Data breaches">
            <p>
              Our Privacy Officer has processes and systems in place in the unfortunate event of a data breach. If
              such an event occurs, we will promptly identify, report and examine a personal data breach.
            </p>
          </Section>

          <Section title="Internet use">
            <p>
              While we take reasonable steps to maintain secure internet connections, if you provide us with
              personal information over the internet, the provision of that information is at your own risk.
            </p>
            <p>
              If you follow a link on our website to another site, the owner of that site will have its own privacy
              policy relating to your personal information. We suggest you review that site&apos;s privacy policy
              before you provide personal information.
            </p>
            <p>
              We use cookies (an alphanumeric identifier that we transfer to your computer&apos;s hard drive so that
              we can recognise your browser) to monitor your use of the website. You may disable cookies by changing
              the settings on your browser, although this may mean that you cannot use all of the features of the
              website.
            </p>
            <p>
              We may use information about your use of our websites and other IT systems to prevent unauthorised
              access or attacks on our software. We may utilise services from one or more third-party suppliers to
              monitor the use of our systems. These third-party suppliers will have access to monitoring and logging
              information as well as information processed on our websites and other IT systems.
            </p>
          </Section>

          <div className="pt-4 border-t border-valar-concrete">
            <Link href="/contact" className="text-valar-amber font-semibold hover:underline text-sm">
              ← Back to Contact
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
