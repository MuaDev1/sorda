// app/about/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function About() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-grow">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6">
          <h1 className="text-4xl font-bold text-purple-300 mb-6">عن الموقع</h1>

          <section className="space-y-6">
            <p className="text-lg text-gray-300">
              موقع <span className="text-purple-400 font-bold">سوردا</span> هو منصة مخصصة لدعم ونشر المانجا العربية، حيث نسعى
              لتقديم محتوى إبداعي يجمع بين الأصالة العربية والأسلوب الفني الحديث. يهدف الموقع إلى تمكين المبدعين العرب
              من عرض أعمالهم والتواصل مع عشاق المانجا في جميع أنحاء العالم.
            </p>

            <p className="text-lg text-gray-300">
              تأسس موقع <span className="text-purple-400 font-bold">سوردا</span> في عام 2024 من قبل مجموعة من المبدعين والمطورين الذين يطمحون
              لدعم الإبداع العربي وتقديم منصة متكاملة لمحبي المانجا. هدفنا هو إنشاء مجتمع متكامل يجمع بين الفنانين
              والقراء لدعم صناعة المانجا في العالم العربي.
            </p>

            <p className="text-lg text-gray-300">
              يقدم موقعنا تشكيلة واسعة من المانجا، بدءًا من الأعمال الكلاسيكية وحتى الإصدارات الحصرية الجديدة. نحن ملتزمون
              بتوفير منصة تتيح تجربة فريدة لمحبي المانجا العرب، ونعمل باستمرار على تطوير خدماتنا لضمان تقديم الأفضل.
            </p>

            <h2 className="text-3xl font-bold text-purple-300 mt-8">مهمتنا</h2>
            <p className="text-lg text-gray-300">
              مهمتنا هي دعم المبدعين العرب في مجال المانجا ومساعدتهم على تحقيق طموحاتهم من خلال توفير منصة احترافية
              تتيح لهم نشر أعمالهم بسهولة. نؤمن بأن الإبداع العربي يستحق أن يصل إلى العالم، ونعمل على جعل ذلك ممكنًا.
            </p>

            <h2 className="text-3xl font-bold text-purple-300 mt-8">فريق العمل</h2>
            <p className="text-lg text-gray-300">
              يضم فريق <span className="text-purple-400 font-bold">سوردا</span> مجموعة متنوعة من الفنانين والمطورين والمصممين الذين يعملون
              بشغف لتقديم تجربة استثنائية. نحن ملتزمون بتحديث الموقع وإضافة ميزات جديدة باستمرار لدعم المبدعين العرب.
            </p>

            <p className="text-lg text-gray-300">
              إذا كانت لديك أي اقتراحات أو استفسارات، لا تتردد في <a href="https://discord.gg/ujBeYRR8NA" className="text-purple-400 hover:underline">التواصل معنا</a>.
              نحن هنا لدعمك ومساعدتك.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
