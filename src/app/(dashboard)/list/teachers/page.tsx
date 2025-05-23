import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch'
import { role } from '@/lib/data';
import Image from 'next/image';
import React from 'react'
import Link from "next/link";
import { Teacher, Subject, Class } from '@prisma/client';
import prisma from '@/lib/prisma';
import FormModal from '@/components/FormModal';

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] };

const columns = [
    {
        header: "Info",
        accessor: "info"
    },
    {
        header: "Teacher ID",
        accessor: "teacherId",
        className: "hidden md:table-cell"
    },
    {
        header: "Subjects",
        accessor: "subjects",
        className: "hidden md:table-cell"
    },
    {
        header: "Classes",
        accessor: "classes",
        className: "hidden md:table-cell"
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell"
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden lg:table-cell"
    },
    {
        header: "Actions",
        accessor: "actions",
    }
];


const renderRow = (item: TeacherList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm
    hover:bg-lamaPurpleLight 
     dark:bg-stone-800 dark:even:bg-stone-900 dark:hover:bg-gray-700
     dark:border-slate-600">
        <td className="flex items-center gap-4 p-4">
            <Image
                src={"/assets/avatar.png"}
                alt=""
                width={40}
                height={40}
                className="xl:block w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.name + " " + item.surname}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.username}</td>
        <td className="hidden md:table-cell">
            {item.subjects.map((subject) => subject.name).join(",")}
        </td>
        <td className="hidden md:table-cell">
            {item.classes.map((classItem) => classItem.name).join(",")}
        </td>
        <td className="hidden lg:table-cell">{item.phone}</td>
        <td className="hidden lg:table-cell">{item.address}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/teachers/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                        <Image src="/assets/eye.png" alt="" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" && (
                    // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple dark:bg-purple-300">
                    //     <Image src="/assets/delete.png" alt="" width={16} height={16} />
                    // </button>
                    <FormModal table="teacher" type="delete" id={item.id} />
                )}
            </div>
        </td>
    </tr>
);

const TeacherList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const teachers = await prisma.teacher.findMany({
        include: {
            subjects: true,
            classes: true,
        },
        take: 10,
        skip: (p - 1) * 10,
    });

    const count = await prisma.teacher.count();

    return (
        <div className='relative bg-white dark:bg-stone-800 p-4 rounded-md flex-1'>
            {/* TOP */}
            <div className='flex items-center justify-between'>
                <h1 className='hidden md:block text-lg font-semibold'>All Teachers</h1>
                <div className='flex flex-col md:flex-row items-cener gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-lamaYellowLight bg-lamaYellow" >
                            <Image src='/assets/filter.png' alt="filter button" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-lamaYellowLight bg-lamaYellow" >
                            <Image src='/assets/sort.png' alt="filter button" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            // <button className="w-8 h-8 flex items-center justify-center rounded-full dark:bg-lamaYellowLight bg-lamaYellow" >
                            //     <Image src='/assets/plus.png' alt="filter button" width={14} height={14} />
                            // </button>
                            <FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div className=''>
                <Table columns={columns} renderRow={renderRow} data={teachers} />
            </div>
            {/* PAGINATION */}
            <Pagination page={p} count={count} />

        </div>
    )
}

export default TeacherList