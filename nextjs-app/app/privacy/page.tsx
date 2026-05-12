// Privacy Policy for WorkoutPartna.
import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '../../components/app/Logo'
import { BackIcon } from '../../components/app/icons'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How WorkoutPartna collects, uses, stores, protects, and shares your information.',
}

export default function PrivacyPage() {
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
        <h1 className="text-[32px] font-extrabold tracking-tight text-white">Privacy Policy</h1>
        <p className="text-[15px] text-[var(--color-text-muted)]">
          WorkoutPartna.com and the WorkoutPartna App
        </p>
        <p className="text-[13px] text-[var(--color-text-dim)]">
          <strong>Last Updated:</strong> May 6, 2026
        </p>
        <p className="text-[13px] text-[var(--color-text-dim)]">
          <strong>Contact for privacy questions:</strong>{' '}
          <a href="mailto:sales@fan2seeproductions.com" className="text-[var(--color-brand-bright)] underline">sales@fan2seeproductions.com</a>
        </p>

        <p className="mt-6">
          WorkoutPartna respects your privacy. This Privacy Policy explains how <strong>WorkoutPartna.com</strong> and the <strong>WorkoutPartna mobile application</strong> collect, use, store, protect, and share information when you visit our website, create an account, use our app, connect with workout partners, communicate with other users, or interact with our services.
        </p>
        <p>
          In this Privacy Policy, &ldquo;WorkoutPartna,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; &ldquo;Platform,&rdquo; or &ldquo;App&rdquo; refers to WorkoutPartna.com, the WorkoutPartna app, and related services.
        </p>
        <p>By using WorkoutPartna, you agree to this Privacy Policy. If you do not agree, do not use the Platform.</p>

        <Section n="1" title="Information We Collect">
          <p>We may collect information directly from you, automatically from your device, and from third-party services you choose to connect.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">A. Account Information</h3>
          <p>When you create an account, we may collect:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Username</li>
            <li>Password or authentication credentials</li>
            <li>Profile photo</li>
            <li>Date of birth or age confirmation</li>
            <li>Gender, if voluntarily provided</li>
            <li>City, state, or general location</li>
            <li>Account preferences</li>
            <li>Login information</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-[16px] font-bold text-white mt-5">B. Fitness Profile Information</h3>
          <p>WorkoutPartna may allow you to create a fitness profile so you can connect with people who have similar goals.</p>
          <p>This may include:</p>
          <ul>
            <li>Workout goals</li>
            <li>Fitness level</li>
            <li>Preferred workout style</li>
            <li>Favorite gym or workout location</li>
            <li>Training schedule</li>
            <li>Preferred workout days and times</li>
            <li>Body goals</li>
            <li>Sports interests</li>
            <li>Accountability preferences</li>
            <li>Gym membership type, if voluntarily provided</li>
            <li>Fitness challenges or community activity</li>
          </ul>
          <p>You should not submit sensitive medical details unless the app specifically asks for them and you are comfortable providing them.</p>
          <p>WorkoutPartna is not a medical provider and does not need detailed medical records to provide its core service.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">C. Location Information</h3>
          <p>WorkoutPartna may collect or use location-related information to help users find workout partners nearby.</p>
          <p>Depending on your device settings and app permissions, this may include:</p>
          <ul>
            <li>Approximate location</li>
            <li>City or region</li>
            <li>ZIP code</li>
            <li>Gym or facility location you choose to enter</li>
            <li>Device-based location, if you grant permission</li>
            <li>Search radius or nearby partner preferences</li>
          </ul>
          <p>You can control location permissions through your device settings. Some features may not work properly if location access is disabled.</p>
          <p>We do not encourage users to share their exact home address publicly.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">D. Messages and User Communications</h3>
          <p>If WorkoutPartna includes messaging, chat, comments, group communication, or community features, we may collect:</p>
          <ul>
            <li>Messages you send or receive through the Platform</li>
            <li>Comments or posts</li>
            <li>Group interactions</li>
            <li>Reports, flags, or safety complaints</li>
            <li>User-to-user communication metadata, such as time sent or recipient</li>
          </ul>
          <p>We may review communications if needed for safety, moderation, legal compliance, fraud prevention, support, or enforcement of our Terms.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">E. Photos, Videos, and Uploaded Content</h3>
          <p>If you upload content, we may collect:</p>
          <ul>
            <li>Profile photos</li>
            <li>Workout photos</li>
            <li>Videos</li>
            <li>Posts</li>
            <li>Reviews</li>
            <li>Comments</li>
            <li>Community content</li>
            <li>Images submitted for verification or profile use</li>
          </ul>
          <p>You are responsible for the content you upload and should avoid posting private, sensitive, or unsafe information.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">F. Payment Information</h3>
          <p>If WorkoutPartna offers paid subscriptions, premium features, event registrations, or in-app purchases, payment information may be processed by third-party payment providers or app stores.</p>
          <p>We may collect limited payment-related information such as:</p>
          <ul>
            <li>Purchase history</li>
            <li>Subscription status</li>
            <li>Transaction ID</li>
            <li>Billing status</li>
            <li>Last four digits of a payment method, if provided by the processor</li>
            <li>App store purchase status</li>
          </ul>
          <p>We do not store full credit card numbers unless clearly stated and handled through a secure payment provider.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">G. Device and Usage Information</h3>
          <p>We may automatically collect information about how you access and use WorkoutPartna, including:</p>
          <ul>
            <li>IP address</li>
            <li>Device type</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>App version</li>
            <li>Pages viewed</li>
            <li>Features used</li>
            <li>Buttons clicked</li>
            <li>Session duration</li>
            <li>Crash logs</li>
            <li>Performance data</li>
            <li>Referral source</li>
            <li>Approximate location from IP address</li>
            <li>Cookies or similar tracking technologies</li>
          </ul>

          <h3 className="text-[16px] font-bold text-white mt-5">H. Information from Third-Party Login or Connected Services</h3>
          <p>If you sign in using Google, Apple, Facebook, or another third-party service, we may receive information authorized by that service, such as:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Profile image</li>
            <li>Account ID</li>
            <li>Authentication token</li>
          </ul>
          <p>Your use of third-party services is also governed by their privacy policies.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">I. Google Sign-In Data (Limited Use)</h3>
          <p>When you choose to sign in with Google, we request only the minimum scopes needed to identify you:</p>
          <ul>
            <li><code>openid</code> &mdash; required for OAuth identity</li>
            <li><code>email</code> &mdash; your Google account email address</li>
            <li><code>profile</code> &mdash; your name and profile picture URL</li>
          </ul>
          <p>We do <strong>not</strong> request or receive access to your Gmail, Google Drive, Google Calendar, contacts, photos, YouTube, or any other Google data.</p>
          <p>WorkoutPartna&rsquo;s use and transfer of information received from Google APIs adheres to the <Link href="https://developers.google.com/terms/api-services-user-data-policy" className="text-[var(--color-brand-bright)] underline">Google API Services User Data Policy</Link>, including the Limited Use requirements. Specifically, we:</p>
          <ul>
            <li>Use Google account data only to create your WorkoutPartna account, sign you in, and personalize your in-app experience.</li>
            <li>Do not sell Google account data to anyone.</li>
            <li>Do not use Google account data for advertising or any retargeting purposes.</li>
            <li>Do not transfer Google account data to third parties except as necessary to provide or improve user-facing features (e.g., our hosting provider stores it as part of your account record), to comply with applicable law, or as part of a merger, acquisition, or sale of assets with appropriate notice.</li>
            <li>Do not allow humans to read your Google account data unless we have your explicit consent, it is necessary for security purposes (such as investigating abuse), to comply with applicable law, or for internal operations where the data has been aggregated and de-identified.</li>
          </ul>
        </Section>

        <Section n="2" title="How We Use Your Information">
          <p>We may use your information to:</p>
          <ul>
            <li>Create and manage your account</li>
            <li>Provide access to WorkoutPartna</li>
            <li>Match you with potential workout partners</li>
            <li>Show your profile to other users based on your settings</li>
            <li>Help users find people with similar fitness goals</li>
            <li>Enable messaging, groups, or community features</li>
            <li>Personalize your app experience</li>
            <li>Improve app functionality</li>
            <li>Send account-related notifications</li>
            <li>Send safety alerts or important updates</li>
            <li>Process payments or subscriptions</li>
            <li>Provide customer support</li>
            <li>Respond to questions or complaints</li>
            <li>Moderate content and enforce our Terms</li>
            <li>Prevent fraud, abuse, spam, harassment, or unsafe behavior</li>
            <li>Analyze app performance</li>
            <li>Fix bugs and technical issues</li>
            <li>Improve marketing and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section n="3" title="How Your Information May Be Shared">
          <p>WorkoutPartna may share information in the following ways:</p>

          <h3 className="text-[16px] font-bold text-white mt-5">A. With Other Users</h3>
          <p>Depending on your profile settings and app features, other users may be able to see:</p>
          <ul>
            <li>Your name or username</li>
            <li>Profile photo</li>
            <li>General location</li>
            <li>Fitness goals</li>
            <li>Preferred workout type</li>
            <li>Gym or workout area you choose to share</li>
            <li>Availability</li>
            <li>Public posts</li>
            <li>Group participation</li>
            <li>Profile details you choose to display</li>
          </ul>
          <p>Do not post information you do not want other users to see.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">B. With Service Providers (Sub-processors)</h3>
          <p>We share information with trusted vendors that help us operate the Platform. Each provider is contractually bound to use your information only to deliver services to us. The current list of sub-processors that may receive personal information is:</p>
          <ul>
            <li><strong>Vercel, Inc.</strong> &mdash; web hosting, deployment, and edge infrastructure for WorkoutPartna.com.</li>
            <li><strong>Supabase Inc.</strong> &mdash; authentication, account database, and file storage for profile content.</li>
            <li><strong>Stripe, Inc.</strong> &mdash; payment processing, subscription billing, and invoice generation for paid features such as the AI Daily Coach. Card numbers are entered directly with Stripe and are never stored on our servers.</li>
            <li><strong>Resend, Inc.</strong> &mdash; transactional email delivery (account confirmation, password reset, welcome, billing receipts).</li>
            <li><strong>Anthropic PBC</strong> &mdash; AI inference for the optional AI Daily Coach feature. We send only your fitness intake fields (goals, fitness level, schedule, equipment, training style, injuries, coaching tone) to generate your daily plan. We do not send your name, email, profile photo, messages with other users, payment information, or Google account data.</li>
            <li><strong>Google LLC</strong> &mdash; only when you choose to sign in with Google. See Section 1(I) for the limited scopes we request and how we use Google account data.</li>
          </ul>
          <p>This list may be updated as the Platform evolves. The most recent version of this Privacy Policy at <Link href="/privacy" className="text-[var(--color-brand-bright)] underline">workoutpartna.com/privacy</Link> always reflects the active sub-processors.</p>
          <p>These providers may only use your information to provide services to us, unless otherwise disclosed.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">C. With App Stores and Payment Platforms</h3>
          <p>If you download the app or make in-app purchases, Apple, Google, or other app stores may process information according to their own privacy policies and platform rules.</p>

          <h3 className="text-[16px] font-bold text-white mt-5">D. For Safety and Legal Reasons</h3>
          <p>We may disclose information if we believe it is necessary to:</p>
          <ul>
            <li>Comply with the law</li>
            <li>Respond to court orders or legal requests</li>
            <li>Protect our rights</li>
            <li>Protect user safety</li>
            <li>Investigate fraud or abuse</li>
            <li>Prevent harm</li>
            <li>Enforce our Terms &amp; Conditions</li>
            <li>Respond to security incidents</li>
            <li>Cooperate with law enforcement when legally required</li>
          </ul>

          <h3 className="text-[16px] font-bold text-white mt-5">E. Business Transfers</h3>
          <p>If WorkoutPartna is involved in a merger, acquisition, sale, financing, restructuring, or transfer of business assets, user information may be transferred as part of that transaction.</p>
        </Section>

        <Section n="4" title="Location Privacy">
          <p>WorkoutPartna may use location features to help connect users with workout partners nearby.</p>
          <p>You are responsible for deciding what location information you share. We recommend that you avoid sharing your exact home address, private residence, or sensitive location information with other users.</p>
          <p>You may disable location permissions through your device settings. Disabling location may limit nearby matching and location-based features.</p>
          <p>WorkoutPartna does not guarantee the safety of any location, gym, meetup, or in-person interaction.</p>
        </Section>

        <Section n="5" title="Health and Fitness Information">
          <p>WorkoutPartna may collect fitness-related information that you voluntarily provide, such as workout goals, activity interests, training preferences, or fitness level.</p>
          <p>WorkoutPartna does not intend to collect detailed medical records, diagnosis information, treatment information, prescription information, or protected health records unless specifically disclosed.</p>
          <p>You should not use WorkoutPartna as a substitute for professional medical advice.</p>
          <p>If you choose to share health or fitness information, you understand that this information may be used to provide app features, improve your experience, and help you connect with other users.</p>
          <p>We recommend limiting what sensitive health information you share publicly.</p>
        </Section>

        <Section n="6" title="Cookies and Tracking Technologies">
          <p>WorkoutPartna.com may use cookies, pixels, local storage, analytics tools, and similar technologies to:</p>
          <ul>
            <li>Keep you logged in</li>
            <li>Remember preferences</li>
            <li>Measure website traffic</li>
            <li>Improve performance</li>
            <li>Understand feature usage</li>
            <li>Support marketing campaigns</li>
            <li>Detect fraud or abuse</li>
          </ul>
          <p>You may be able to control cookies through your browser settings. Some website features may not work properly if cookies are disabled.</p>
        </Section>

        <Section n="7" title="Analytics and Advertising">
          <p>We may use analytics tools to understand how users interact with WorkoutPartna.</p>
          <p>These tools may collect information such as:</p>
          <ul>
            <li>Device type</li>
            <li>App version</li>
            <li>Pages viewed</li>
            <li>Features used</li>
            <li>Session behavior</li>
            <li>Crash reports</li>
            <li>Approximate location</li>
            <li>Referral source</li>
          </ul>
          <p>If we use advertising or retargeting tools in the future, we may collect and share information for marketing purposes as permitted by law and platform rules.</p>
          <p>Where required, we will provide opt-out options or consent notices.</p>
        </Section>

        <Section n="8" title="Push Notifications, Email, and SMS">
          <p>WorkoutPartna may send:</p>
          <ul>
            <li>Account notifications</li>
            <li>Match notifications</li>
            <li>Message alerts</li>
            <li>Workout reminders</li>
            <li>Safety alerts</li>
            <li>App updates</li>
            <li>Promotional emails</li>
            <li>SMS messages, if you opt in</li>
          </ul>
          <p>You may opt out of promotional emails by using the unsubscribe link.</p>
          <p>You may disable push notifications in your device settings.</p>
          <p>You may opt out of SMS messages by replying &ldquo;STOP,&rdquo; if SMS features are used.</p>
          <p>Some account, security, or legal messages may still be sent even if you opt out of marketing messages.</p>
        </Section>

        <Section n="9" title="Data Security">
          <p>We use reasonable administrative, technical, and physical safeguards to protect personal information.</p>
          <p>However, no website, app, database, network, or electronic system is completely secure.</p>
          <p>We cannot guarantee that unauthorized access, hacking, data loss, or security breaches will never occur.</p>
          <p>You are responsible for protecting your password, device, account access, and login credentials.</p>
        </Section>

        <Section n="10" title="Data Retention">
          <p>We keep personal information for as long as necessary to:</p>
          <ul>
            <li>Provide the Platform</li>
            <li>Maintain your account</li>
            <li>Resolve disputes</li>
            <li>Enforce our Terms</li>
            <li>Prevent fraud or abuse</li>
            <li>Meet legal, tax, accounting, security, and business obligations</li>
            <li>Improve and operate our services</li>
          </ul>
          <p>If you delete your account, we may delete or anonymize certain information, unless we need to keep it for legal, safety, fraud prevention, dispute resolution, or business purposes.</p>
          <p>Messages, posts, or content shared with other users may remain visible or stored for a period of time after account deletion, depending on how the app is designed.</p>
        </Section>

        <Section n="11" title="Your Privacy Choices">
          <p>Depending on where you live, you may have rights to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Request a copy of your information</li>
            <li>Opt out of certain marketing communications</li>
            <li>Limit certain data uses</li>
            <li>Withdraw consent where consent is required</li>
            <li>Disable location permissions</li>
            <li>Delete your account</li>
          </ul>
          <p>To make a privacy request, contact us using the information at the bottom of this Privacy Policy.</p>
          <p>We may need to verify your identity before completing certain requests.</p>
        </Section>

        <Section n="12" title="Account Deletion">
          <p>You may request deletion of your WorkoutPartna account by contacting us at:</p>
          <p>
            <a className="text-[var(--color-brand-bright)] underline" href="mailto:sales@fan2seeproductions.com">sales@fan2seeproductions.com</a>
          </p>
          <p>If the app includes an account deletion feature, you may also delete your account through the app settings.</p>
          <p>After deletion, some information may be retained where legally required or reasonably necessary for safety, fraud prevention, dispute resolution, tax, accounting, legal compliance, or enforcement of our Terms.</p>
        </Section>

        <Section n="13" title="Children's Privacy">
          <p>WorkoutPartna is not intended for children under 13.</p>
          <p>We do not knowingly collect personal information from children under 13.</p>
          <p>If we learn that we have collected personal information from a child under 13 without required parental consent, we will take reasonable steps to delete that information.</p>
          <p>Users under 18 should only use WorkoutPartna with permission from a parent or legal guardian, unless our app provides a specific minor-use policy.</p>
        </Section>

        <Section n="14" title="California and Other State Privacy Rights">
          <p>Depending on your state or country of residence, you may have additional privacy rights.</p>
          <p>These may include the right to know what personal information we collect, the right to request deletion, the right to correct information, the right to opt out of certain sharing, or the right to limit certain uses of sensitive personal information.</p>
          <p>WorkoutPartna will honor applicable privacy rights where required by law.</p>
          <p>To submit a request, contact us at:</p>
          <p>
            <a className="text-[var(--color-brand-bright)] underline" href="mailto:sales@fan2seeproductions.com">sales@fan2seeproductions.com</a>
          </p>
        </Section>

        <Section n="15" title="International Users">
          <p>WorkoutPartna is operated from the United States.</p>
          <p>If you access the Platform from outside the United States, you understand that your information may be transferred to, processed in, and stored in the United States or other countries where our service providers operate.</p>
          <p>Privacy laws in those locations may differ from the laws in your country.</p>
        </Section>

        <Section n="16" title="Third-Party Links">
          <p>WorkoutPartna may contain links to third-party websites, gyms, services, advertisers, payment processors, app stores, social media platforms, or partner services.</p>
          <p>We are not responsible for the privacy practices, content, safety, or policies of third-party websites or services.</p>
          <p>You should review their privacy policies before providing information to them.</p>
        </Section>

        <Section n="17" title="User Safety and Public Sharing">
          <p>WorkoutPartna is a community-based platform. Information you choose to share publicly or with other users may be seen, saved, screenshotted, copied, or shared by others.</p>
          <p>WorkoutPartna cannot control what other users do with information you voluntarily share.</p>
          <p>For your safety, avoid posting:</p>
          <ul>
            <li>Home address</li>
            <li>Exact real-time location</li>
            <li>Financial information</li>
            <li>Private medical information</li>
            <li>Government identification numbers</li>
            <li>Passwords</li>
            <li>Sensitive personal details</li>
            <li>Information about children</li>
            <li>Anything you do not want other users to see</li>
          </ul>
        </Section>

        <Section n="18" title="Data Breach Notification">
          <p>If we discover a data breach that legally requires notice, we will notify affected users, regulators, or other required parties as required by applicable law.</p>
          <p>Because WorkoutPartna may involve fitness or wellness-related information, certain breach notification rules may apply depending on what information is collected and how it is stored.</p>
        </Section>

        <Section n="19" title="Changes to This Privacy Policy">
          <p>We may update this Privacy Policy from time to time.</p>
          <p>If we make material changes, we may notify users through the app, website, email, or other reasonable method.</p>
          <p>The updated policy will be effective when posted unless otherwise stated.</p>
          <p>Your continued use of WorkoutPartna means you accept the updated Privacy Policy.</p>
        </Section>

        <Section n="20" title="Google API Services Compliance">
          <p>WorkoutPartna&rsquo;s use and transfer of any information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-[var(--color-brand-bright)] underline">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
          <p>The Google scopes WorkoutPartna requests when you sign in with Google are limited to:</p>
          <ul>
            <li><code>openid</code></li>
            <li><code>email</code></li>
            <li><code>profile</code></li>
          </ul>
          <p>WorkoutPartna does not access, store, or transmit any data from Gmail, Google Drive, Google Calendar, Google Contacts, Google Photos, YouTube, or any other Google service. We use the data we receive solely to:</p>
          <ul>
            <li>Create and authenticate your WorkoutPartna account</li>
            <li>Display your name and profile picture inside the app to you and to users you choose to interact with</li>
            <li>Send transactional emails related to your account</li>
          </ul>
          <p>We do not sell, license, or otherwise monetize Google account data, and we do not use it for advertising. You may revoke WorkoutPartna&rsquo;s access to your Google account at any time at <a href="https://myaccount.google.com/permissions" className="text-[var(--color-brand-bright)] underline">myaccount.google.com/permissions</a>.</p>
          <p>If you delete your WorkoutPartna account, the Google account data we hold (your Google email, account ID, and profile fields cached at sign-in) is deleted within 30 days, except where retention is required by law.</p>
        </Section>

        <Section n="21" title="Contact Us">
          <p>If you have questions about this Privacy Policy or want to make a privacy request, contact us at:</p>
          <p>
            <strong>WorkoutPartna</strong>
            <br />
            Website: <a className="text-[var(--color-brand-bright)] underline" href="https://workoutpartna.com">workoutpartna.com</a>
            <br />
            App: <strong>WorkoutPartna</strong>
            <br />
            Email: <a className="text-[var(--color-brand-bright)] underline" href="mailto:sales@fan2seeproductions.com">sales@fan2seeproductions.com</a>
          </p>
        </Section>

        <Section n="22" title="Suggested App Consent Language">
          <p>When creating an account, WorkoutPartna may require users to confirm:</p>
          <blockquote className="border-l-4 border-[var(--color-brand)] pl-4 italic text-white/85 my-3">
            &ldquo;I agree to the WorkoutPartna <Link href="/terms" className="text-[var(--color-brand-bright)] underline not-italic">Terms &amp; Conditions</Link>, Privacy Policy, and Liability Waiver. I understand that WorkoutPartna may collect and use my profile, fitness preference, communication, device, and location-related information to provide app features and connect me with potential workout partners.&rdquo;
          </blockquote>
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
