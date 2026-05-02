// Terms & Conditions for WorkoutPartna.
import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '../../components/app/Logo'
import { BackIcon } from '../../components/app/icons'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'WorkoutPartna terms and conditions.',
}

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-5 py-3 flex items-center gap-3">
          <Link
            href="/app"
            aria-label="Back"
            className="h-9 w-9 rounded-full border border-[var(--color-border)] bg-white/[0.04] flex items-center justify-center text-white/85"
          >
            <BackIcon width={18} height={18} />
          </Link>
          <Logo size={20} withWordmark />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10 prose prose-invert text-white/85 leading-relaxed">
        <h1 className="text-[32px] font-extrabold tracking-tight text-white">Terms &amp; Conditions</h1>
        <p className="text-[15px] text-[var(--color-text-muted)]">
          WorkoutPartna.com and the WorkoutPartna App
        </p>
        <p className="text-[13px] text-[var(--color-text-dim)]">
          <strong>Last Updated:</strong> May 1, 2026
        </p>

        <p className="mt-6">
          Welcome to <strong>WorkoutPartna.com</strong> and the <strong>WorkoutPartna mobile application</strong> collectively referred to as &ldquo;WorkoutPartna,&rdquo; &ldquo;the Platform,&rdquo; &ldquo;the App,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our.&rdquo;
        </p>
        <p>
          By accessing, browsing, creating an account, using, or participating in any feature, service, community, workout connection, messaging feature, event, fitness recommendation, or content provided through WorkoutPartna, you agree to be bound by these Terms &amp; Conditions.
        </p>
        <p>If you do not agree to these Terms, do not use WorkoutPartna.</p>

        <Section n="1" title="Purpose of WorkoutPartna">
          <p>WorkoutPartna is a fitness networking and community platform designed to help users connect with other individuals who may be interested in fitness, workouts, gym accountability, wellness goals, exercise routines, and related activities.</p>
          <p>WorkoutPartna may allow users to:</p>
          <ul>
            <li>Create profiles</li>
            <li>Connect with other users</li>
            <li>Communicate with workout partners</li>
            <li>Share fitness goals, routines, interests, or availability</li>
            <li>Discover people at gyms, apartment fitness centers, fitness clubs, or other workout locations</li>
            <li>Participate in community features, challenges, groups, events, or app-based fitness interactions</li>
          </ul>
          <p>WorkoutPartna is <strong>not</strong> a medical provider, personal training provider, healthcare provider, emergency service, background-check service, transportation provider, gym operator, or physical security provider.</p>
        </Section>

        <Section n="2" title="No Medical Advice">
          <p>All content, features, messages, recommendations, workout ideas, fitness discussions, user-generated posts, app-generated suggestions, and information provided through WorkoutPartna are for <strong>general informational and community purposes only</strong>.</p>
          <p>WorkoutPartna does <strong>not</strong> provide:</p>
          <ul>
            <li>Medical advice</li>
            <li>Medical diagnosis</li>
            <li>Medical treatment</li>
            <li>Physical therapy</li>
            <li>Nutrition therapy</li>
            <li>Mental health counseling</li>
            <li>Licensed personal training services</li>
            <li>Emergency medical services</li>
          </ul>
          <p>You should consult a qualified physician or healthcare professional before beginning any exercise program, changing your workout routine, increasing physical activity, changing your diet, or participating in any fitness activity, especially if you have a medical condition, injury, disability, pregnancy, heart condition, diabetes, blood pressure issues, or any other health concern.</p>
          <p>You agree that you are solely responsible for determining whether you are physically and medically able to participate in any workout, fitness activity, gym session, challenge, meetup, exercise, or interaction arranged through WorkoutPartna.</p>
        </Section>

        <Section n="3" title="Assumption of Risk">
          <p>You understand and agree that fitness activities involve inherent risks, including but not limited to:</p>
          <ul>
            <li>Muscle soreness</li>
            <li>Sprains and strains</li>
            <li>Falls</li>
            <li>Equipment-related injuries</li>
            <li>Dehydration</li>
            <li>Overexertion</li>
            <li>Fainting</li>
            <li>Heart-related events</li>
            <li>Serious bodily injury</li>
            <li>Permanent disability</li>
            <li>Death</li>
            <li>Property damage</li>
            <li>Personal disputes</li>
            <li>Unsafe interactions with other users</li>
            <li>Risks associated with meeting people online or in person</li>
          </ul>
          <p>By using WorkoutPartna, you knowingly and voluntarily assume all risks related to your use of the Platform, including risks connected to exercise, communication with other users, meeting users in person, attending gyms or fitness locations, and participating in any fitness-related activity.</p>
          <p>You are responsible for your own safety, health, decisions, conduct, and personal judgment at all times.</p>
        </Section>

        <Section n="4" title="Liability Release and Waiver">
          <p>To the fullest extent permitted by law, you voluntarily release, waive, discharge, and hold harmless WorkoutPartna, WorkoutPartna.com, its owners, founders, members, managers, employees, contractors, developers, affiliates, partners, advertisers, sponsors, successors, and assigns from any and all claims, demands, damages, losses, liabilities, injuries, costs, expenses, causes of action, or legal claims arising out of or related to:</p>
          <ul>
            <li>Your use of WorkoutPartna</li>
            <li>Your reliance on any information provided through the Platform</li>
            <li>Your participation in any workout, exercise, challenge, event, or activity</li>
            <li>Your communication with other users</li>
            <li>Your decision to meet another user in person</li>
            <li>Any injury, illness, death, or property damage</li>
            <li>Any dispute between you and another user</li>
            <li>Any gym, trainer, venue, facility, third-party business, or outside location</li>
            <li>User-generated content</li>
            <li>Technical errors, downtime, bugs, or service interruptions</li>
            <li>Unauthorized access to your account caused by your failure to secure your login information</li>
            <li>Any third-party links, services, or integrations</li>
          </ul>
          <p>You agree that WorkoutPartna is not responsible for the actions, omissions, statements, fitness advice, conduct, background, criminal history, health status, physical ability, or behavior of any user.</p>
        </Section>

        <Section n="5" title="User Responsibility">
          <p>You agree that you are solely responsible for:</p>
          <ul>
            <li>Your own physical condition</li>
            <li>Your own health and safety</li>
            <li>Your own workout decisions</li>
            <li>Your own exercise intensity</li>
            <li>Your own use of gym equipment</li>
            <li>Your own interactions with other users</li>
            <li>Verifying the safety of any location where you choose to meet</li>
            <li>Deciding whether another user is safe or appropriate to meet</li>
            <li>Following all gym, facility, apartment, park, or venue rules</li>
            <li>Complying with all applicable laws</li>
            <li>Securing your personal belongings</li>
            <li>Protecting your personal information</li>
            <li>Using common sense when meeting people online or in person</li>
          </ul>
          <p>You should never meet another user in a private, unsafe, isolated, or unfamiliar location without taking proper precautions. WorkoutPartna does not guarantee user identity, safety, background, fitness ability, intentions, or trustworthiness.</p>
        </Section>

        <Section n="6" title="No Background Checks">
          <p>WorkoutPartna does not represent or warrant that users have been screened, verified, background checked, medically cleared, or professionally evaluated.</p>
          <p>Even if WorkoutPartna offers verification features in the future, such features do not guarantee that a user is safe, honest, qualified, healthy, or free from risk.</p>
          <p>You are solely responsible for deciding whether to communicate with, train with, or meet another user.</p>
        </Section>

        <Section n="7" title="User Conduct">
          <p>You agree not to use WorkoutPartna to:</p>
          <ul>
            <li>Harass, threaten, abuse, stalk, intimidate, or harm others</li>
            <li>Post false, misleading, offensive, illegal, or harmful content</li>
            <li>Impersonate another person or business</li>
            <li>Upload viruses, malware, or harmful code</li>
            <li>Scrape, copy, reverse engineer, or exploit the Platform</li>
            <li>Use the Platform for illegal activity</li>
            <li>Promote drugs, unsafe supplements, weapons, violence, or illegal services</li>
            <li>Send spam, scams, or fraudulent messages</li>
            <li>Collect user information without permission</li>
            <li>Discriminate against, degrade, or target users unlawfully</li>
            <li>Arrange unsafe, illegal, or harmful activities</li>
          </ul>
          <p>WorkoutPartna reserves the right to suspend, restrict, or delete any account at any time for behavior we believe violates these Terms, creates risk, harms the community, or damages the Platform.</p>
        </Section>

        <Section n="8" title="User-Generated Content">
          <p>Users may be able to upload, post, share, send, or display content, including photos, profile information, workout goals, messages, comments, videos, reviews, or other materials.</p>
          <p>You are solely responsible for the content you submit.</p>
          <p>By posting content on WorkoutPartna, you grant WorkoutPartna a non-exclusive, worldwide, royalty-free license to use, display, reproduce, modify, distribute, and promote that content in connection with operating, improving, marketing, and displaying the Platform.</p>
          <p>You represent that you own or have the legal right to post any content you upload.</p>
          <p>WorkoutPartna is not responsible for user-generated content and does not endorse any user&rsquo;s statements, advice, opinions, claims, or recommendations.</p>
        </Section>

        <Section n="9" title="Fitness Results Are Not Guaranteed">
          <p>WorkoutPartna does not guarantee any specific fitness, health, weight loss, strength, appearance, performance, wellness, or lifestyle result.</p>
          <p>Results vary based on many factors, including your health, consistency, genetics, diet, sleep, effort, exercise choices, medical history, and other personal circumstances.</p>
          <p>Any examples, testimonials, progress posts, transformation stories, or user results shown on the Platform are not guarantees that you will achieve the same or similar results.</p>
        </Section>

        <Section n="10" title="Third-Party Gyms, Facilities, Trainers, and Services">
          <p>WorkoutPartna may reference, display, integrate with, or allow users to mention third-party gyms, apartment gyms, fitness centers, parks, trainers, events, businesses, or services.</p>
          <p>WorkoutPartna does not own, control, operate, inspect, supervise, or guarantee any third-party location, service, facility, trainer, equipment, or business.</p>
          <p>You agree that WorkoutPartna is not responsible for:</p>
          <ul>
            <li>Gym conditions</li>
            <li>Equipment safety</li>
            <li>Facility rules</li>
            <li>Trainer conduct</li>
            <li>Venue security</li>
            <li>Parking lots</li>
            <li>Injuries at third-party locations</li>
            <li>Membership issues</li>
            <li>Fees charged by third parties</li>
            <li>Disputes with gyms, trainers, facilities, or other businesses</li>
          </ul>
          <p>Your relationship with any third-party business is solely between you and that third party.</p>
        </Section>

        <Section n="11" title="Account Security">
          <p>You are responsible for maintaining the confidentiality of your login credentials and account information.</p>
          <p>You agree to notify us immediately if you believe your account has been accessed without authorization.</p>
          <p>WorkoutPartna is not responsible for losses caused by your failure to protect your password, device, account, or login information.</p>
        </Section>

        <Section n="12" title="Payments, Subscriptions, and Refunds">
          <p>If WorkoutPartna offers paid subscriptions, premium features, events, promotions, or in-app purchases, all payment terms will be disclosed at the time of purchase.</p>
          <p>Unless otherwise stated, all purchases are final and non-refundable to the fullest extent permitted by law.</p>
          <p>WorkoutPartna may change pricing, features, subscription plans, or payment terms at any time. Any changes will apply prospectively unless otherwise required by law.</p>
          <p>Third-party app stores, payment processors, or platforms may have their own terms and refund policies.</p>
        </Section>

        <Section n="13" title="Privacy">
          <p>Your use of WorkoutPartna is also governed by our <Link href="/privacy" className="text-[var(--color-brand-bright)] underline">Privacy Policy</Link>, which explains how we collect, use, store, and share information.</p>
          <p>By using WorkoutPartna, you agree to our collection and use of information as described in the Privacy Policy.</p>
          <p>If WorkoutPartna collects health, fitness, location, biometric, or sensitive personal information, additional privacy rights, consents, or legal obligations may apply.</p>
        </Section>

        <Section n="14" title="Location-Based Features">
          <p>WorkoutPartna may use location-based features to help users connect with others nearby or identify general workout areas.</p>
          <p>You understand that sharing your location may create personal safety risks. You are responsible for managing your device permissions and deciding whether to share location information.</p>
          <p>WorkoutPartna does not guarantee the accuracy, availability, or safety of any location-based feature.</p>
        </Section>

        <Section n="15" title="Technology Disclaimer">
          <p>WorkoutPartna is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.</p>
          <p>We do not guarantee that:</p>
          <ul>
            <li>The Platform will always be available</li>
            <li>The Platform will be error-free</li>
            <li>Bugs will be fixed immediately</li>
            <li>The Platform will be secure from all attacks</li>
            <li>Messages will always be delivered</li>
            <li>User data will never be lost</li>
            <li>Features will remain available forever</li>
            <li>The Platform will meet every user expectation</li>
          </ul>
          <p>We may modify, suspend, restrict, or discontinue any part of WorkoutPartna at any time.</p>
        </Section>

        <Section n="16" title="Limitation of Liability">
          <p>To the fullest extent permitted by law, WorkoutPartna and its owners, founders, members, managers, employees, contractors, affiliates, partners, advertisers, sponsors, successors, and assigns shall not be liable for any indirect, incidental, consequential, special, punitive, exemplary, or enhanced damages, including but not limited to:</p>
          <ul>
            <li>Lost profits</li>
            <li>Lost business</li>
            <li>Lost data</li>
            <li>Lost opportunities</li>
            <li>Emotional distress</li>
            <li>Personal injury</li>
            <li>Property damage</li>
            <li>Reputational harm</li>
            <li>Losses caused by other users</li>
            <li>Losses caused by third parties</li>
            <li>Losses related to fitness activities</li>
            <li>Losses related to in-person meetups</li>
          </ul>
          <p>To the fullest extent permitted by law, WorkoutPartna&rsquo;s total liability for any claim arising out of or related to your use of the Platform shall not exceed the greater of:</p>
          <ol>
            <li>The amount you paid to WorkoutPartna in the three months before the claim arose; or</li>
            <li>$100.00.</li>
          </ol>
          <p>Some jurisdictions do not allow certain limitations of liability, so some of these limitations may not apply to you.</p>
        </Section>

        <Section n="17" title="Indemnification">
          <p>You agree to defend, indemnify, and hold harmless WorkoutPartna, WorkoutPartna.com, its owners, founders, members, managers, employees, contractors, affiliates, partners, advertisers, sponsors, successors, and assigns from and against any claims, damages, losses, liabilities, judgments, settlements, costs, or expenses, including reasonable attorney&rsquo;s fees, arising out of or related to:</p>
          <ul>
            <li>Your use of the Platform</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any law or regulation</li>
            <li>Your interaction with another user</li>
            <li>Your participation in any workout or fitness activity</li>
            <li>Your content</li>
            <li>Your negligence, misconduct, or unsafe behavior</li>
            <li>Your infringement of another person&rsquo;s rights</li>
          </ul>
        </Section>

        <Section n="18" title="Age Requirement">
          <p>You must be at least 18 years old to use WorkoutPartna unless we provide a separate minor-use policy with verified parental or guardian consent.</p>
          <p>By using WorkoutPartna, you represent that you are at least 18 years old or have legal permission from a parent or guardian where required.</p>
          <p>WorkoutPartna is not intended for unsupervised use by children.</p>
        </Section>

        <Section n="19" title="Community Safety">
          <p>WorkoutPartna encourages users to act responsibly and safely.</p>
          <p>When meeting another user:</p>
          <ul>
            <li>Meet in a public place</li>
            <li>Tell someone where you are going</li>
            <li>Do not share sensitive personal information too soon</li>
            <li>Do not send money to users</li>
            <li>Trust your instincts</li>
            <li>Leave any situation that feels unsafe</li>
            <li>Report suspicious behavior</li>
            <li>Call emergency services if you are in danger</li>
          </ul>
          <p>WorkoutPartna is not responsible for monitoring or controlling offline interactions.</p>
        </Section>

        <Section n="20" title="Termination">
          <p>We may suspend, limit, or terminate your account at any time if we believe you have violated these Terms, created risk, harmed another user, misused the Platform, violated the law, or acted in a way that damages WorkoutPartna or its community.</p>
          <p>You may stop using WorkoutPartna at any time.</p>
          <p>Certain sections of these Terms will survive termination, including liability release, limitation of liability, indemnification, intellectual property, dispute resolution, and any provisions that by their nature should survive.</p>
        </Section>

        <Section n="21" title="Intellectual Property">
          <p>WorkoutPartna, WorkoutPartna.com, the WorkoutPartna name, logo, design, features, software, text, graphics, branding, source code, user interface, and related materials are owned by WorkoutPartna or its licensors.</p>
          <p>You may not copy, reproduce, distribute, modify, sell, license, reverse engineer, or exploit any part of the Platform without written permission.</p>
        </Section>

        <Section n="22" title="Changes to These Terms">
          <p>We may update these Terms from time to time.</p>
          <p>When we make changes, we may update the &ldquo;Last Updated&rdquo; date above. Continued use of WorkoutPartna after changes are posted means you accept the updated Terms.</p>
          <p>If you do not agree to the updated Terms, you must stop using the Platform.</p>
        </Section>

        <Section n="23" title="Governing Law">
          <p>These Terms shall be governed by the laws of the State of <strong>Texas</strong>, without regard to conflict of law principles.</p>
          <p>Any disputes shall be handled in the courts located in <strong>Harris County, Texas</strong>, unless applicable law requires otherwise.</p>
        </Section>

        <Section n="24" title="Contact Information">
          <p>If you have questions about these Terms, contact us at:</p>
          <p>
            <strong>WorkoutPartna</strong>
            <br />
            Website: <a className="text-[var(--color-brand-bright)] underline" href="https://workoutpartna.com">workoutpartna.com</a>
            <br />
            Email: <a className="text-[var(--color-brand-bright)] underline" href="mailto:sales@fan2seeproductions.com">sales@fan2seeproductions.com</a>
          </p>
        </Section>

        <Section n="25" title="User Acknowledgment">
          <p>By creating an account, clicking &ldquo;I Agree,&rdquo; accessing WorkoutPartna.com, downloading the WorkoutPartna app, or using any feature of the Platform, you confirm that:</p>
          <ul>
            <li>You have read these Terms</li>
            <li>You understand these Terms</li>
            <li>You voluntarily agree to these Terms</li>
            <li>You understand that fitness activities involve risk</li>
            <li>You agree to assume responsibility for your own safety</li>
            <li>You release WorkoutPartna from liability to the fullest extent permitted by law</li>
          </ul>
        </Section>

        <div className="h-12" />
      </article>
    </main>
  )
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-extrabold text-white tracking-tight">
        <span className="text-[var(--color-brand-bright)] mr-2">{n}.</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1">
        {children}
      </div>
    </section>
  )
}
