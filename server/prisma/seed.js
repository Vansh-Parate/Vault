import { PrismaClient, CredentialCategory, VerificationStatus, Visibility } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    // Clean existing data
    await prisma.accessLog.deleteMany();
    await prisma.shareLink.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.user.deleteMany();
    // Create mock user
    const user = await prisma.user.create({
        data: {
            id: 'cluser00000000000000000000',
            name: 'Arjun Sharma',
            email: 'arjun@example.com',
            dateFormat: 'DD MMM YYYY',
            defaultVis: Visibility.PRIVATE,
        },
    });
    console.log(`Created user: ${user.name} (${user.id})`);
    // Create sample credentials
    const credentials = await Promise.all([
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.IDENTITY,
                title: 'Aadhaar Card',
                issuer: 'UIDAI',
                issuedDate: new Date('2019-03-15'),
                status: VerificationStatus.VERIFIED,
                metadata: {
                    fullName: 'Arjun Sharma',
                    idType: 'Aadhaar',
                    idNumber: 'XXXX-XXXX-4532',
                    issuingAuthority: 'UIDAI, Government of India',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.IDENTITY,
                title: 'PAN Card',
                issuer: 'Income Tax Department',
                issuedDate: new Date('2018-07-22'),
                status: VerificationStatus.VERIFIED,
                metadata: {
                    fullName: 'Arjun Sharma',
                    idType: 'PAN',
                    idNumber: 'ABCPS1234K',
                    issuingAuthority: 'Income Tax Department, India',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.EDUCATION,
                title: 'B.Tech Computer Science',
                issuer: 'BITS Pilani',
                issuedDate: new Date('2022-06-15'),
                status: VerificationStatus.VERIFIED,
                metadata: {
                    institution: 'BITS Pilani',
                    degree: 'B.Tech Computer Science',
                    fieldOfStudy: 'Computer Science & Engineering',
                    startDate: '2018-08-01',
                    graduationDate: '2022-06-15',
                    grade: '8.7 CGPA',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.EMPLOYMENT,
                title: 'Software Engineer — Google',
                issuer: 'Google India Pvt. Ltd.',
                issuedDate: new Date('2022-07-18'),
                status: VerificationStatus.VERIFIED,
                metadata: {
                    company: 'Google India Pvt. Ltd.',
                    jobTitle: 'Software Engineer',
                    employmentType: 'Full-time',
                    startDate: '2022-07-18',
                    description: 'Working on Cloud Infrastructure team building distributed systems.',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.SKILLS,
                title: 'AWS Solutions Architect',
                issuer: 'Amazon Web Services',
                issuedDate: new Date('2024-01-15'),
                expiryDate: new Date('2027-01-15'),
                status: VerificationStatus.VERIFIED,
                metadata: {
                    certName: 'AWS Solutions Architect — Associate',
                    issuingBody: 'Amazon Web Services',
                    credentialId: 'AWS-SAA-2024-78234',
                    credentialUrl: 'https://aws.amazon.com/verification/78234',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.SKILLS,
                title: 'Google Cloud Professional Data Engineer',
                issuer: 'Google Cloud',
                issuedDate: new Date('2023-09-20'),
                expiryDate: new Date('2025-09-20'),
                status: VerificationStatus.EXPIRED,
                metadata: {
                    certName: 'Google Cloud Professional Data Engineer',
                    issuingBody: 'Google Cloud',
                    credentialId: 'GCP-PDE-2023-45102',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.FINANCIAL,
                title: 'HDFC Bank Salary Account',
                issuer: 'HDFC Bank',
                issuedDate: new Date('2022-08-01'),
                status: VerificationStatus.PENDING,
                metadata: {
                    institution: 'HDFC Bank',
                    accountType: 'Salary',
                    incomeRange: '₹12L–₹25L',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.HEALTHCARE,
                title: 'COVID-19 Vaccination Certificate',
                issuer: 'CoWIN — Ministry of Health',
                issuedDate: new Date('2021-10-05'),
                status: VerificationStatus.VERIFIED,
                metadata: {
                    provider: 'CoWIN — Ministry of Health',
                    recordType: 'Vaccination',
                    notes: 'Covishield — 2 doses completed',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.GOVERNMENT,
                title: 'Income Tax Return — AY 2024-25',
                issuer: 'Income Tax Department',
                issuedDate: new Date('2024-07-31'),
                status: VerificationStatus.PENDING,
                metadata: {
                    documentType: 'Tax Return',
                    issuingAuthority: 'Income Tax Department',
                    documentNumber: 'ITR-2024-ABCPS1234K',
                },
            },
        }),
        prisma.credential.create({
            data: {
                userId: user.id,
                category: CredentialCategory.IDENTITY,
                title: 'Passport',
                issuer: 'Ministry of External Affairs',
                issuedDate: new Date('2020-02-14'),
                expiryDate: new Date('2030-02-13'),
                status: VerificationStatus.VERIFIED,
                metadata: {
                    fullName: 'Arjun Sharma',
                    idType: 'Passport',
                    idNumber: 'J8234567',
                    issuingAuthority: 'Ministry of External Affairs, India',
                },
            },
        }),
    ]);
    console.log(`Created ${credentials.length} credentials`);
    // Create some access logs
    const logs = await Promise.all([
        prisma.accessLog.create({
            data: {
                userId: user.id,
                credentialId: credentials[4].id, // AWS cert
                action: 'shared',
                accessedBy: 'Self',
                timestamp: new Date('2026-03-12T10:34:00'),
            },
        }),
        prisma.accessLog.create({
            data: {
                userId: user.id,
                credentialId: credentials[2].id, // BITS degree
                action: 'viewed',
                accessedBy: 'Self',
                timestamp: new Date('2026-03-11T15:12:00'),
            },
        }),
        prisma.accessLog.create({
            data: {
                userId: user.id,
                credentialId: credentials[0].id, // Aadhaar
                action: 'exported',
                accessedBy: 'Self',
                timestamp: new Date('2026-03-10T09:45:00'),
            },
        }),
        prisma.accessLog.create({
            data: {
                userId: user.id,
                credentialId: credentials[3].id, // Google employment
                action: 'shared',
                accessedBy: 'Self',
                timestamp: new Date('2026-03-09T14:22:00'),
            },
        }),
        prisma.accessLog.create({
            data: {
                userId: user.id,
                credentialId: credentials[9].id, // Passport
                action: 'viewed',
                accessedBy: 'Self',
                timestamp: new Date('2026-03-08T11:05:00'),
            },
        }),
    ]);
    console.log(`Created ${logs.length} access log entries`);
    console.log('Seed completed successfully!');
    console.log(`\nMock User ID: ${user.id}`);
    console.log('Set this as MOCK_USER_ID in your .env files');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map